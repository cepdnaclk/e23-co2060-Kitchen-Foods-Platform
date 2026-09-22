import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Test-database helper.
 *
 * The dev backend wipes its schema on every restart (initDb), so tests run
 * against a dedicated `kitchen-foods-test` database instead:
 *   - ensureTestDatabase(): creates the DB if it does not exist (connects to
 *     the always-present `postgres` database for the CREATE DATABASE call).
 *   - resetSchema(): drops + recreates the schema from the SQL files in
 *     backend/database (same files the dev server uses).
 *   - truncateAll(): empties tables between suites without re-applying DDL.
 *   - seedFixtureUsers(): stable users used across integration suites.
 */

export const TEST_DB = process.env.DB_NAME || "kitchen-foods-test";

const connectionDefaults = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 5433),
  user: process.env.DB_USER || "postgres",
  password: String(process.env.DB_PASSWORD || "zoom119"),
};

/** Pool bound to the test database (matches src/config/db.js config). */
export function createTestPool() {
  return new pg.Pool({ ...connectionDefaults, database: TEST_DB });
}

/** Create the test database if missing. Safe to call on every run. */
export async function ensureTestDatabase() {
  const admin = new pg.Pool({ ...connectionDefaults, database: "postgres" });
  try {
    const exists = await admin.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [TEST_DB],
    );
    if (exists.rows.length === 0) {
      await admin.query(`CREATE DATABASE "${TEST_DB}"`);
      console.log(`Created test database: ${TEST_DB}`);
    }
  } finally {
    await admin.end();
  }
}

/** Drop + recreate the schema from backend/database/*.sql (dev parity). */
export async function resetSchema(pool) {
  await pool.query("DROP SCHEMA IF EXISTS public CASCADE");
  await pool.query("CREATE SCHEMA public");
  await pool.query("GRANT ALL ON SCHEMA public TO PUBLIC");

  const dbDir = path.resolve(__dirname, "../../database");
  const files = fs
    .readdirSync(dbDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(dbDir, file), "utf8");
    await pool.query(sql);
  }
}

/** Empty every table (order matters: quotes -> orders -> food -> users). */
export async function truncateAll(pool) {
  await pool.query(`
    TRUNCATE TABLE
      transactions,
      quotes,
      orders,
      food_items,
      food_categories,
      chefs,
      admin,
      users
    RESTART IDENTITY CASCADE
  `);
}

/**
 * Stable fixture users, mirroring insert-test-users.js. Re-inserting with
 * ON CONFLICT DO NOTHING keeps them idempotent.
 */
export async function seedFixtureUsers(pool) {
  const passwordHash = await bcrypt.hash("password123", 10);

  await pool.query(
    `INSERT INTO users (uid, full_name, email, password_hash, role)
     VALUES
       ('u-cust-1', 'Alice Customer', 'alice@test.com', $1, 'Customer'),
       ('u-cust-2', 'Bob Customer', 'bob@test.com', $1, 'Customer')
     ON CONFLICT (uid) DO NOTHING`,
    [passwordHash],
  );

  await pool.query(
    `INSERT INTO chefs (uid, full_name, email, password_hash, role, approval_status)
     VALUES
       ('u-chef-1', 'Chef Ranjan', 'ranjan@test.com', $1, 'Chef', 'Approved'),
       ('u-chef-2', 'Chef Gajan', 'gajan@test.com', $1, 'Chef', 'Approved'),
       ('u-chef-3', 'Chef Pending', 'pending@test.com', $1, 'Chef', 'Pending')
     ON CONFLICT (uid) DO NOTHING`,
    [passwordHash],
  );

  await pool.query(
    `INSERT INTO admin (uid, full_name, email, password_hash, role)
     VALUES ('u-admin-1', 'Admin User', 'admin@test.com', $1, 'Admin')
     ON CONFLICT (uid) DO NOTHING`,
    [passwordHash],
  );

  await pool.query(
    `INSERT INTO food_categories (id, name, description)
     VALUES
       ('cat-rice', 'Rice & Curry', 'Traditional Sri Lankan rice dishes'),
       ('cat-other', 'Other', 'Everything else')
     ON CONFLICT (id) DO NOTHING`,
  );
}

/** Create a food item owned by a fixture chef; returns the row. */
export async function createFoodItem(
  pool,
  { chefId = "u-chef-1", categoryId = "cat-rice", price = 1500, name = "Test Dish" } = {},
) {
  const result = await pool.query(
    `INSERT INTO food_items (id, name, description, price, chef_id, image_url, category_id)
     VALUES (gen_random_uuid()::text, $1, 'A tasty test dish', $2, $3, '/uploads/test.jpg', $4)
     RETURNING id`,
    [name, price, chefId, categoryId],
  );
  return result.rows[0];
}

/** Create an order row directly; returns the full row. */
export async function createOrderRow(
  pool,
  {
    customerId = "u-cust-1",
    mealDescription = "Two plates of rice and curry",
    foodItemId = null,
    chefId = null,
    quantity = 2,
    totalPrice = 3000,
    status = "Pending",
    expiresInSeconds = 3600,
  } = {},
) {
  const result = await pool.query(
    `INSERT INTO orders (
       id, customer_id, meal_description, food_item_id, chef_id,
       quantity, total_price, status, expires_at
     )
     VALUES (
       'ORD-' || substr(md5(random()::text), 1, 8), $1, $2, $3, $4,
       $5, $6, $7, NOW() + make_interval(secs => $8)
     )
     RETURNING *`,
    [
      customerId,
      mealDescription,
      foodItemId,
      chefId,
      quantity,
      totalPrice,
      status,
      expiresInSeconds,
    ],
  );
  return result.rows[0];
}
