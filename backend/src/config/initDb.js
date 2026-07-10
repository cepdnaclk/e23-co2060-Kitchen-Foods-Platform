import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "./db.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const initDb = async () => {
  try {
    const schemaPath = path.resolve(__dirname, "../../database/01_schema.sql");
    const seedPath = path.resolve(__dirname, "../../database/02_seed.sql");

    const schema = fs.readFileSync(schemaPath, "utf8");
    await pool.query(schema);
    console.log("Database schema applied");

    if (fs.existsSync(seedPath)) {
      const seed = fs.readFileSync(seedPath, "utf8");
      await pool.query(seed);
      console.log("Seed data applied");
    }

    // Env-driven admin seed (preferred for deployments like Railway)
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (adminEmail && adminPassword) {
      try {
        const full_name = (adminEmail.split("@")[0] || "Admin")
          .replace(/\.|_|-/g, " ")
          .replace(/(^|\s)\S/g, (s) => s.toUpperCase());

        const passwordHash = await bcrypt.hash(adminPassword, 10);
        const uid = uuidv4();

        await pool.query(
          `INSERT INTO admin (uid, full_name, email, password_hash, role)
           VALUES ($1,$2,$3,$4,$5)
           ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, full_name = EXCLUDED.full_name`,
          [uid, full_name, adminEmail, passwordHash, "Admin"],
        );

        console.log(`Admin seeded/updated for ${adminEmail}`);
      } catch (e) {
        console.error("Failed to seed admin from env:", e.message);
      }
    }
  } catch (err) {
    console.error("Database initialization error:", err.message);
  }
};
