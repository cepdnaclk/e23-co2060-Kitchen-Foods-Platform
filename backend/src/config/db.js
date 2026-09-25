import pkg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: "./.env" });
dotenv.config({ path: path.resolve(__dirname, "../../.env") }); // Load environment variables from .env file

const { Pool } = pkg;

// Railway/managed Postgres exposes a single DATABASE_URL; local dev uses DB_* vars
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.DB_SSL === "false"
          ? undefined
          : { rejectUnauthorized: false },
      // Fail fast instead of hanging startup (which makes Railway return 502)
      connectionTimeoutMillis: 10_000,
    })
  : new Pool({
      user: process.env.DB_USER || "postgres",
      host: process.env.DB_HOST || "127.0.0.1",
      database: process.env.DB_NAME || "kitchen-foods",
      password: String(process.env.DB_PASSWORD || "zoom119"), // Keeps SCRAM happy by guaranteeing a string
      port: Number(process.env.DB_PORT || 5432),
    });

// testing connection
pool.on("connect", () => {
  console.log("Connection pool established successfully!");
});

export default pool;
