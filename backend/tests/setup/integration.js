import { beforeAll, beforeEach, afterAll } from "vitest";
import {
  createTestPool,
  ensureTestDatabase,
  resetSchema,
  truncateAll,
  seedFixtureUsers,
} from "./db.js";
import pg from "pg";

/**
 * Shared bootstrap for DB-backed integration suites.
 *
 * If Postgres is unreachable the suites are skipped (not failed) with a
 * clear message — so `npm test` still works on machines without the DB,
 * while CI (which provisions Postgres) always runs them.
 *
 * Usage in a test file:
 *   import { dbAvailable, integrationSetup, getPool } from "../setup/integration.js";
 *   describe.runIf(dbAvailable)("orders api", () => { integrationSetup(); ... });
 */

const connectionDefaults = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 5433),
  user: process.env.DB_USER || "postgres",
  password: String(process.env.DB_PASSWORD || "zoom119"),
};

export let dbAvailable = false;

// Probe connectivity once at collection time (top-level await is fine in ESM).
try {
  const probe = new pg.Pool({
    ...connectionDefaults,
    database: "postgres",
    connectionTimeoutMillis: 3000,
    max: 1,
  });
  await probe.query("SELECT 1");
  await probe.end();
  dbAvailable = true;
} catch {
  console.warn(
    `\n⚠ Postgres not reachable at ${connectionDefaults.host}:${connectionDefaults.port} ` +
      `- skipping DB integration tests. Start it with: docker compose up -d postgres\n`,
  );
}

let pool;

export async function integrationSetup() {
  if (!dbAvailable) return;

  pool = createTestPool();

  beforeAll(async () => {
    await ensureTestDatabase();
    await resetSchema(pool);
    await seedFixtureUsers(pool);
  });

  beforeEach(async () => {
    // Keep fixture users, wipe transactional data between tests.
    await pool.query("TRUNCATE quotes, orders, food_items, transactions CASCADE");
    await seedFixtureUsers(pool);
  });

  afterAll(async () => {
    await pool.end();
  });
}

/** Pool for the current suite (call after integrationSetup()). */
export function getPool() {
  if (!pool) throw new Error("integrationSetup() has not been called yet");
  return pool;
}
