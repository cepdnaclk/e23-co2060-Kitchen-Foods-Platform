import pkg from "pg";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

dotenv.config({ path: "./.env" });

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || "yourdb",
  user: process.env.DB_USER || "youruser",
  password: process.env.DB_PASSWORD || "yourpassword",
});

const testUsers = [
  {
    full_name: "Admin User",
    email: "admin@test.com",
    password: "12345678",
    role: "Admin",
    profile_img_url: "",
  },
  {
    full_name: "Chef Ranjan",
    email: "chef@test.com",
    password: "12345678",
    role: "Chef",
    // Chefs must be approved by an admin to sign in, so test chefs start Approved.
    approval_status: "Approved",
    profile_img_url:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop",
  },
  {
    full_name: "Bob Customer",
    email: "customer2@test.com",
    password: "12345678",
    role: "Customer",
    profile_img_url:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop",
  },
];

async function insertTestUsers() {
  const client = await pool.connect();

  try {
    const inserted = [];

    for (const user of testUsers) {
      const passwordHash = await bcrypt.hash(user.password, 10);
      const uid = uuidv4();

      // Determine which table to insert into based on role
      let tableName;
      let roleValue;

      switch (user.role) {
        case "Admin":
          tableName = "admin";
          roleValue = "Admin";
          break;
        case "Chef":
          tableName = "chefs";
          roleValue = "Chef";
          break;
        case "Customer":
          tableName = "users";
          roleValue = "Customer";
          break;
        default:
          console.error(`Unknown role: ${user.role}`);
          continue;
      }

      // Only chefs carry an approval_status column; they default to "Pending"
      // unless the test data explicitly sets them to "Approved".
      const isChef = user.role === "Chef";
      const columns = isChef
        ? "(uid, full_name, email, password_hash, role, approval_status, profile_img_url)"
        : "(uid, full_name, email, password_hash, role, profile_img_url)";
      const placeholders = isChef
        ? "($1, $2, $3, $4, $5, $6, $7)"
        : "($1, $2, $3, $4, $5, $6)";
      const values = isChef
        ? [
            uid,
            user.full_name,
            user.email,
            passwordHash,
            roleValue,
            user.approval_status || "Pending",
            user.profile_img_url || null,
          ]
        : [
            uid,
            user.full_name,
            user.email,
            passwordHash,
            roleValue,
            user.profile_img_url || null,
          ];
      const returning = isChef
        ? "RETURNING uid, full_name, email, role, approval_status"
        : "RETURNING uid, full_name, email, role, NULL::varchar AS approval_status";

      const result = await client.query(
        `INSERT INTO ${tableName} ${columns}
         VALUES ${placeholders}
         ON CONFLICT (email) DO NOTHING
         ${returning}`,
        values,
      );

      if (result.rows.length > 0) {
        inserted.push({
          ...result.rows[0],
          table: tableName,
        });
      }
    }

    if (inserted.length === 0) {
      console.log("No new users inserted (all emails already exist).");
    } else {
      console.log("Inserted users:");
      console.table(inserted);
    }
  } catch (error) {
    console.error("Error inserting test users:", error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

insertTestUsers();
