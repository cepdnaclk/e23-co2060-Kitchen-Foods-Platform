import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pkg from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const initDbProd = async (pool) => {
  try {
    // Check if tables already exist
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'users'
      );
    `);
    
    if (result.rows[0].exists) {
      console.log("Database tables already exist — skipping schema init");
      return;
    }

    console.log("Initializing database schema...");
    const dbDir = path.resolve(__dirname, "../../database");
    const files = fs.readdirSync(dbDir)
      .filter(f => f.endsWith(".sql"))
      .sort();

    for (const file of files) {
      const sql = fs.readFileSync(path.join(dbDir, file), "utf8");
      await pool.query(sql);
      console.log(`Executed ${file}`);
    }
    console.log("Database initialized successfully");
  } catch (err) {
    console.error("Database initialization error:", err.message);
  }
};
