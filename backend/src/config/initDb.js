import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const initDb = async () => {
  try {
    await pool.query("DROP SCHEMA IF EXISTS public CASCADE");
    await pool.query("CREATE SCHEMA IF NOT EXISTS public");
    await pool.query("GRANT ALL ON SCHEMA public TO PUBLIC");
    console.log("Database wiped");

    const dbDir = path.resolve(__dirname, "../../database");
    const files = fs.readdirSync(dbDir)
      .filter(f => f.endsWith(".sql"))
      .sort();

    for (const file of files) {
      const sql = fs.readFileSync(path.join(dbDir, file), "utf8");
      await pool.query(sql);
      console.log(`Executed ${file}`);
    }
  } catch (err) {
    console.error("Database initialization error:", err.message);
  }
};
