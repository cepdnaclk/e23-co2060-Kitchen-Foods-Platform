// ---------------------------------------------------------------------------
// Test environment setup — runs before any test file is loaded.
// ---------------------------------------------------------------------------
// Points the app at a dedicated test database so dev data is never touched.
// backend/.env is deliberately NOT relied on: these explicit values override
// it (dotenv never overwrites already-set vars), keeping tests self-contained
// and safe to run on any machine.
// ---------------------------------------------------------------------------

process.env.NODE_ENV = "test";
// Pin the timezone so date-parsing tests (e.g. Order.computeExpiry, which
// parses `YYYY-MM-DDTHH:mm` in local time) are deterministic everywhere.
// Node invalidates its TZ cache when process.env.TZ is assigned.
process.env.TZ = "UTC";
process.env.DB_NAME = process.env.DB_NAME || "kitchen-foods-test";
process.env.DB_HOST = process.env.DB_HOST || "127.0.0.1";
process.env.DB_PORT = process.env.DB_PORT || "5433"; // docker-compose host port
process.env.DB_USER = process.env.DB_USER || "postgres";
process.env.DB_PASSWORD = process.env.DB_PASSWORD || "zoom119";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret";
// Shorten the bidding window so expiry tests are fast and deterministic.
process.env.BID_WINDOW_HOURS = process.env.BID_WINDOW_HOURS || "6";
process.env.BID_LEAD_HOURS = process.env.BID_LEAD_HOURS || "6";
