import { v4 as uuidv4 } from 'uuid';
import pool from "../config/db.js";

const httpError = (statusCode, message) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

/** Bidding window for an order (hours from creation, unless overridden). */
const bidWindowHours = () => Number(process.env.BID_WINDOW_HOURS) || 6;
/** Orders stop accepting bids this many hours before the requested fulfillment time. */
const bidLeadHours = () => Number(process.env.BID_LEAD_HOURS) || 6;

class Order {
  constructor(
    id,
    customerId,
    mealDescription,
    status,
    createdAt,
    foodItemId,
    chefId,
    quantity,
    totalPrice,
    deliveryDate,
    deliveryTime,
    customerName,
    foodItemName,
    expiresAt = null,
    quoteCount = 0,
  ) {
    this.id = id;
    this.customerId = customerId;
    this.mealDescription = mealDescription;
    this.status = status;
    this.createdAt = createdAt;
    this.foodItemId = foodItemId;
    this.chefId = chefId;
    this.quantity = quantity;
    this.totalPrice = totalPrice;
    this.deliveryDate = deliveryDate;
    this.deliveryTime = deliveryTime;
    this.customerName = customerName;
    this.foodItemName = foodItemName;
    this.expiresAt = expiresAt;
    this.quoteCount = quoteCount;
  }

  static mapRow(row) {
    return new Order(
      row.id,
      row.customer_id,
      row.meal_description,
      row.status,
      row.created_at,
      row.food_item_id,
      row.chef_id,
      row.quantity,
      row.total_price,
      row.delivery_date,
      row.delivery_time,
      row.customer_name,
      row.food_item_name,
      row.expires_at,
      row.quote_count ?? 0,
    );
  }

  /**
   * When does this order stop accepting quotes? The earlier of:
   *  - a fixed window after creation (default 6h), or
   *  - a lead time before the requested fulfillment moment (default 6h),
   *    when a delivery date + time are supplied.
   */
  static computeExpiry(deliveryDate, deliveryTime) {
    const now = Date.now();
    let expiresAt = new Date(now + bidWindowHours() * 3600_000);

    if (deliveryDate && deliveryTime) {
      const fulfillment = new Date(`${deliveryDate}T${deliveryTime}`);
      if (!Number.isNaN(fulfillment.getTime())) {
        const leadBoundary = new Date(fulfillment.getTime() - bidLeadHours() * 3600_000);
        if (leadBoundary.getTime() < expiresAt.getTime()) expiresAt = leadBoundary;
      }
    }

    return expiresAt.toISOString();
  }

  static async create({
    customerId,
    mealDescription,
    foodItemId,
    chefId,
    quantity,
    totalPrice,
    deliveryDate,
    deliveryTime,
  }) {
    const id = `ORD-${uuidv4().substring(0, 8).toUpperCase()}`;
    const expiresAt = Order.computeExpiry(deliveryDate, deliveryTime);
    const result = await pool.query(
      `INSERT INTO orders (
        id, customer_id, meal_description, food_item_id, chef_id,
        quantity, total_price, delivery_date, delivery_time, expires_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        id,
        customerId,
        mealDescription,
        foodItemId,
        chefId,
        quantity,
        totalPrice,
        deliveryDate,
        deliveryTime,
        expiresAt,
      ],
    );

    return Order.mapRow(result.rows[0]);
  }

  /**
   * The chef-facing feed:
   *  - every order still open for bidding (Pending & not expired), plus
   *  - orders the chef is already working on (Quoted/Preparing/Ready/Delivered).
   * Expired / assigned-to-others / cancelled orders are excluded.
   */
  static async findByChefId(chefId) {
    const result = await pool.query(
      `SELECT
        o.*,
        u.full_name AS customer_name,
        fi.name AS food_item_name,
        (SELECT COUNT(*)::int FROM quotes q WHERE q.order_id = o.id AND q.status = 'Pending') AS quote_count
       FROM orders o
       LEFT JOIN users u ON o.customer_id = u.uid
       LEFT JOIN food_items fi ON o.food_item_id = fi.id
       WHERE (o.status = 'Pending' AND (o.expires_at IS NULL OR o.expires_at > NOW()))
          OR (o.chef_id = $1 AND o.status IN ('Quoted', 'Preparing', 'Ready', 'Delivered'))
       ORDER BY o.created_at DESC`,
      [chefId],
    );

    return result.rows.map(Order.mapRow);
  }

  static async claimOrder(id, chefId) {
    const result = await pool.query(
      `UPDATE orders
       SET chef_id = $1, status = 'Preparing'
       WHERE id = $2 AND status = 'Pending'
       RETURNING *`,
      [chefId, id],
    );
    return result.rows[0] ? Order.mapRow(result.rows[0]) : null;
  }

  static async findByCustomerId(customerId) {
    const result = await pool.query(
      `SELECT
        o.*,
        u.full_name AS customer_name,
        fi.name AS food_item_name,
        (SELECT COUNT(*)::int FROM quotes q WHERE q.order_id = o.id AND q.status = 'Pending') AS quote_count
       FROM orders o
       JOIN users u ON o.customer_id = u.uid
       LEFT JOIN food_items fi ON o.food_item_id = fi.id
       WHERE o.customer_id = $1
       ORDER BY o.created_at DESC`,
      [customerId],
    );

    return result.rows.map(Order.mapRow);
  }

  static async updateStatus(id, status) {
    const result = await pool.query(
      `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id],
    );
    return result.rows[0] ? Order.mapRow(result.rows[0]) : null;
  }

  /**
   * Automatic expiry sweep: marks overdue Pending orders as 'Expired' and
   * voids every active quote on them. Called on a server interval and
   * lazily before feed reads.
   */
  static async expireOverdue() {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const res = await client.query(
        `UPDATE orders
         SET status = 'Expired'
         WHERE status = 'Pending' AND expires_at IS NOT NULL AND expires_at < NOW()
         RETURNING id`,
      );
      const ids = res.rows.map((r) => r.id);
      if (ids.length > 0) {
        await client.query(
          `UPDATE quotes
           SET status = 'Rejected', updated_at = CURRENT_TIMESTAMP
           WHERE order_id = ANY($1::varchar[]) AND status = 'Pending'`,
          [ids],
        );
      }
      await client.query("COMMIT");
      return ids.length;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Customer cancellation of an open order. Runs atomically with the order
   * row locked so it can't race an acceptance, and voids every active quote
   * so participating chefs see their bids rejected.
   */
  static async cancelOrder(id, customerId) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const orderRes = await client.query(
        "SELECT * FROM orders WHERE id = $1 FOR UPDATE",
        [id],
      );
      const order = orderRes.rows[0];
      if (!order) throw httpError(404, "Order not found");
      if (order.customer_id !== customerId) {
        throw httpError(403, "Only the customer who placed this order can cancel it");
      }
      if (order.status !== "Pending") {
        throw httpError(409, "Only pending orders can be cancelled");
      }

      await client.query("UPDATE orders SET status = 'Cancelled' WHERE id = $1", [id]);
      await client.query(
        `UPDATE quotes
         SET status = 'Rejected', updated_at = CURRENT_TIMESTAMP
         WHERE order_id = $1 AND status = 'Pending'`,
        [id],
      );

      await client.query("COMMIT");
      return Order.mapRow({ ...order, status: "Cancelled" });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
}

export default Order;
