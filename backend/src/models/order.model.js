import { v4 as uuidv4 } from 'uuid';
import pool from "../config/db.js";

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
    foodItemName
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
      row.food_item_name
    );
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
    const result = await pool.query(
      `INSERT INTO orders (
        id, customer_id, meal_description, food_item_id, chef_id, 
        quantity, total_price, delivery_date, delivery_time
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
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
      ]
    );

    return Order.mapRow(result.rows[0]);
  }

  static async findByChefId(chefId) {
    const result = await pool.query(
      `SELECT 
        o.*, 
        u.full_name AS customer_name,
        fi.name AS food_item_name
       FROM orders o
       JOIN users u ON o.customer_id = u.uid
       LEFT JOIN food_items fi ON o.food_item_id = fi.id
       WHERE o.chef_id = $1
       ORDER BY o.created_at DESC`,
      [chefId]
    );

    return result.rows.map(Order.mapRow);
  }

  static async findByCustomerId(customerId) {
    const result = await pool.query(
      `SELECT 
        o.*, 
        u.full_name AS customer_name,
        fi.name AS food_item_name
       FROM orders o
       JOIN users u ON o.customer_id = u.uid
       LEFT JOIN food_items fi ON o.food_item_id = fi.id
       WHERE o.customer_id = $1
       ORDER BY o.created_at DESC`,
      [customerId]
    );

    return result.rows.map(Order.mapRow);
  }

  static async updateStatus(id, status) {
    const result = await pool.query(
      `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return result.rows[0] ? Order.mapRow(result.rows[0]) : null;
  }
}

export default Order;
