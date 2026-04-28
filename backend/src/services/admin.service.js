import bcrypt from "bcrypt";
import pool from "../config/db.js";
import Food from "../models/food.model.js";
import {
  createUserService,
  deleteUserByIdService,
  getAllUsersService,
  updateUserByIdService,
} from "./user.service.js";

const VALID_ORDER_STATUSES = new Set(["Pending", "Quoted", "Paid", "Completed"]);

export const getStatsService = async () => {
  const [userCount, chefCount, orderCount, foodCount] = await Promise.all([
    pool.query("SELECT COUNT(*)::int AS count FROM users"),
    pool.query("SELECT COUNT(*)::int AS count FROM users WHERE role = 'Chef'"),
    pool.query("SELECT COUNT(*)::int AS count FROM orders"),
    pool.query("SELECT COUNT(*)::int AS count FROM food_items"),
  ]);

  return {
    totalUsers: userCount.rows[0].count,
    activeChefs: chefCount.rows[0].count,
    totalOrders: orderCount.rows[0].count,
    totalFoodItems: foodCount.rows[0].count,
  };
};

const buildActivities = async () => {
  const result = await pool.query(
    `SELECT
      CONCAT('ORD-', o.id) AS id,
      'Order created' AS action,
      COALESCE(u.full_name, 'Customer') AS actor,
      CONCAT(o.id, ' - ', o.status) AS target,
      o.created_at AS ts
     FROM orders o
     LEFT JOIN users u ON u.uid = o.customer_id
     ORDER BY o.created_at DESC
     LIMIT 5`,
  );

  return result.rows.map((row) => ({
    id: row.id,
    action: row.action,
    actor: row.actor,
    target: row.target,
    timestamp: new Date(row.ts).toISOString(),
  }));
};

export const getDashboardOverviewService = async () => {
  const [stats, activities] = await Promise.all([
    getStatsService(),
    buildActivities(),
  ]);

  return { stats, activities };
};

export const getUsersService = async () => getAllUsersService();

export const createUserByAdminService = async ({
  full_name,
  email,
  password,
  role,
}) => {
  const passwordHash = await bcrypt.hash(password, 10);
  return createUserService(full_name, email, passwordHash, role);
};

export const updateUserByAdminService = async (id, { full_name, email, role }) =>
  updateUserByIdService(id, full_name, email, role);

export const removeUserByAdminService = async (id) => deleteUserByIdService(id);

export const getFoodService = async () => Food.findAll();

export const addFoodService = async ({
  name,
  description,
  price,
  chefId,
  imageUrl,
  categoryId,
}) => Food.create(name, description, price, chefId, imageUrl, categoryId);

export const updateFoodService = async (
  id,
  { name, description, price, chefId, imageUrl, categoryId },
) =>
  Food.updateById(id, name, description, price, chefId, imageUrl, categoryId);

export const removeFoodService = async (id) => Food.deleteById(id);

export const getOrdersService = async () => {
  const result = await pool.query(
    `SELECT
      o.id,
      COALESCE(u.full_name, 'Unknown customer') AS customer,
      o.meal_description,
      o.status
     FROM orders o
     LEFT JOIN users u ON u.uid = o.customer_id
     ORDER BY o.created_at DESC`,
  );

  return result.rows.map((row) => ({
    id: row.id,
    customer: row.customer,
    mealDescription: row.meal_description,
    status: row.status,
  }));
};

export const updateOrderStatusService = async (id, status) => {
  if (!VALID_ORDER_STATUSES.has(status)) {
    const err = new Error("Invalid order status");
    err.statusCode = 400;
    throw err;
  }

  const result = await pool.query(
    `UPDATE orders
     SET status = $1
     WHERE id = $2
     RETURNING id, meal_description, status`,
    [status, id],
  );

  if (!result.rows[0]) return null;

  const customerResult = await pool.query(
    `SELECT COALESCE(u.full_name, 'Unknown customer') AS customer
     FROM orders o
     LEFT JOIN users u ON u.uid = o.customer_id
     WHERE o.id = $1`,
    [id],
  );

  return {
    id: result.rows[0].id,
    customer: customerResult.rows[0]?.customer || "Unknown customer",
    mealDescription: result.rows[0].meal_description,
    status: result.rows[0].status,
  };
};

export const deleteOrderService = async (id) => {
  const result = await pool.query(
    "DELETE FROM orders WHERE id = $1 RETURNING id",
    [id],
  );

  return result.rows[0] || null;
};
