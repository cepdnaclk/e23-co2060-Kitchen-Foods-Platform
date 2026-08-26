import { v4 as uuidv4 } from "uuid";
import pool from "../config/db.js";

const httpError = (statusCode, message) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

class Quote {
  constructor({
    id,
    orderId,
    chefId,
    price,
    note,
    fulfillmentTime,
    status,
    createdAt,
    updatedAt,
    chefName,
    chefAvatar,
    orderDescription,
    orderStatus,
    deliveryDate,
    deliveryTime,
    customerName,
  }) {
    this.id = id;
    this.orderId = orderId;
    this.chefId = chefId;
    this.price = Number(price);
    this.note = note;
    this.fulfillmentTime = fulfillmentTime;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.chefName = chefName || null;
    this.chefAvatar = chefAvatar || null;
    this.orderDescription = orderDescription || null;
    this.orderStatus = orderStatus || null;
    this.deliveryDate = deliveryDate || null;
    this.deliveryTime = deliveryTime || null;
    this.customerName = customerName || null;
  }

  static mapRow(row) {
    return new Quote({
      id: row.id,
      orderId: row.order_id,
      chefId: row.chef_id,
      price: row.price,
      note: row.note,
      fulfillmentTime: row.fulfillment_time,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      chefName: row.chef_name,
      chefAvatar: row.chef_avatar,
      orderDescription: row.order_description,
      orderStatus: row.order_status,
      deliveryDate: row.delivery_date,
      deliveryTime: row.delivery_time,
      customerName: row.customer_name,
    });
  }

  /**
   * Chef submits or updates their bid on an open order.
   *
   * Business rules enforced here:
   *  - The order row is locked (SELECT ... FOR UPDATE) so a bid can never
   *    race an acceptance — the accepting transaction holds the same lock.
   *  - Only 'Pending' (open) orders accept bids.
   *  - Expired orders reject bids.
   *  - A chef cannot bid on their own request.
   *  - One active quote per chef per order: re-submitting UPDATES the
   *    existing bid, but only while it is still 'Pending'. Accepted or
   *    Rejected quotes are immutable.
   */
  static async upsert({ orderId, chefId, price, note, fulfillmentTime }) {
    if (!orderId || !chefId) throw httpError(400, "orderId and chefId are required");
    if (!price || Number(price) <= 0) throw httpError(400, "A valid quote price is required");

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Lock the order row so an acceptance can't interleave.
      const orderRes = await client.query(
        "SELECT id, status, customer_id, expires_at FROM orders WHERE id = $1 FOR UPDATE",
        [orderId],
      );
      const order = orderRes.rows[0];
      if (!order) throw httpError(404, "Order not found");
      if (order.status !== "Pending") {
        throw httpError(409, "This order is no longer open for bidding");
      }
      if (order.expires_at && new Date(order.expires_at).getTime() < Date.now()) {
        throw httpError(409, "This order has expired and no longer accepts quotes");
      }
      if (order.customer_id === chefId) {
        throw httpError(409, "You cannot bid on your own request");
      }

      // Guard against stale sessions: the chef's uid must still exist in the
      // chefs table (the DB wipes on every backend restart, and re-running
      // seed scripts can invalidate old uids). Fail early with a clear message
      // instead of a raw foreign-key violation.
      const chefRes = await client.query(
        "SELECT 1 FROM chefs WHERE uid = $1",
        [chefId],
      );
      if (!chefRes.rows[0]) {
        throw httpError(
          409,
          "Your chef account is not recognised. Please log out and log back in, then try again.",
        );
      }

      const id = `QT-${uuidv4().substring(0, 8).toUpperCase()}`;
      const result = await client.query(
        `INSERT INTO quotes (id, order_id, chef_id, price, note, fulfillment_time, status)
         VALUES ($1, $2, $3, $4, $5, $6, 'Pending')
         ON CONFLICT (order_id, chef_id)
         DO UPDATE SET
           price = EXCLUDED.price,
           note = EXCLUDED.note,
           fulfillment_time = EXCLUDED.fulfillment_time,
           updated_at = CURRENT_TIMESTAMP
           WHERE quotes.status = 'Pending'
         RETURNING *`,
        [id, orderId, chefId, price, note || null, fulfillmentTime || null],
      );

      await client.query("COMMIT");

      if (!result.rows[0]) {
        throw httpError(409, "Your existing bid has already been locked and cannot be changed");
      }
      return Quote.mapRow(result.rows[0]);
    } catch (err) {
      await client.query("ROLLBACK");
      // Safety net: translate a stale-chef foreign-key violation into a
      // friendly message instead of leaking the raw Postgres error.
      if (err.code === "23503" && err.constraint === "quotes_chef_id_fkey") {
        throw httpError(
          409,
          "Your chef account is not recognised. Please log out and log back in, then try again.",
        );
      }
      throw err;
    } finally {
      client.release();
    }
  }

  /** All quotes on an order, with chef identity — sorted by price ascending. */
  static async findByOrderId(orderId) {
    const result = await pool.query(
      `SELECT
         q.*,
         c.full_name AS chef_name,
         c.profile_img_url AS chef_avatar
       FROM quotes q
       JOIN chefs c ON c.uid = q.chef_id
       WHERE q.order_id = $1
       ORDER BY q.price ASC, q.created_at ASC`,
      [orderId],
    );
    return result.rows.map(Quote.mapRow);
  }

  /** A chef's bids across all orders, with order context. */
  static async findByChefId(chefId) {
    const result = await pool.query(
      `SELECT
         q.*,
         o.meal_description AS order_description,
         o.status AS order_status,
         o.delivery_date,
         o.delivery_time,
         u.full_name AS customer_name
       FROM quotes q
       JOIN orders o ON o.id = q.order_id
       LEFT JOIN users u ON u.uid = o.customer_id
       WHERE q.chef_id = $1
       ORDER BY q.created_at DESC`,
      [chefId],
    );
    return result.rows.map(Quote.mapRow);
  }

  static async findById(id) {
    const result = await pool.query("SELECT * FROM quotes WHERE id = $1", [id]);
    return result.rows[0] ? Quote.mapRow(result.rows[0]) : null;
  }

  /**
   * Atomic quote acceptance — the lock-in phase.
   *
   * Runs in one transaction with the order row locked FOR UPDATE so that:
   *  - only the owning customer can accept,
   *  - the order must still be open ('Pending'),
   *  - the chosen quote must still be active ('Pending'),
   *  - the accepted quote becomes 'Accepted' and the order locks to the
   *    winning chef (status 'Quoted', chef_id + total_price set),
   *  - every competing quote on the order is atomically 'Rejected'.
   *
   * Any concurrent quote submission blocks on the order lock and then fails
   * with 409 because the order is no longer 'Pending'.
   */
  static async acceptQuote({ orderId, quoteId, customerId }) {
    if (!orderId || !quoteId || !customerId) {
      throw httpError(400, "orderId, quoteId and customerId are required");
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const orderRes = await client.query(
        "SELECT * FROM orders WHERE id = $1 FOR UPDATE",
        [orderId],
      );
      const order = orderRes.rows[0];
      if (!order) throw httpError(404, "Order not found");
      if (order.customer_id !== customerId) {
        throw httpError(403, "Only the customer who placed this order can accept a quote");
      }
      if (order.status !== "Pending") {
        throw httpError(409, "This order is no longer open for bidding");
      }

      const quoteRes = await client.query(
        "SELECT * FROM quotes WHERE id = $1 AND order_id = $2 FOR UPDATE",
        [quoteId, orderId],
      );
      const quote = quoteRes.rows[0];
      if (!quote) throw httpError(404, "Quote not found for this order");
      if (quote.status !== "Pending") {
        throw httpError(409, "This quote is no longer active");
      }

      // Lock in the winning quote and reject every competitor.
      await client.query(
        `UPDATE quotes
         SET status = 'Rejected', updated_at = CURRENT_TIMESTAMP
         WHERE order_id = $1 AND id <> $2 AND status = 'Pending'`,
        [orderId, quoteId],
      );
      await client.query(
        `UPDATE quotes
         SET status = 'Accepted', updated_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [quoteId],
      );
      await client.query(
        `UPDATE orders
         SET status = 'Quoted', chef_id = $1, total_price = $2
         WHERE id = $3`,
        [quote.chef_id, quote.price, orderId],
      );

      await client.query("COMMIT");

      return {
        orderId,
        quoteId,
        chefId: quote.chef_id,
        price: Number(quote.price),
        orderStatus: "Quoted",
      };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
}

export default Quote;
