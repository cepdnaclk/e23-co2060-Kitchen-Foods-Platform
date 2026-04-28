import pkg from "pg";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config({ path: "./.env" });

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "yourdb",
  user: process.env.DB_USER || "youruser",
  password: process.env.DB_PASSWORD || "yourpassword",
});

async function insertUser() {
  // Get arguments from command line
  const args = process.argv.slice(2);

  if (args.length < 3) {
    console.log(`
Usage: node insert-user-cli.js <full_name> <email> <password> [role]

Example:
  node insert-user-cli.js "John Doe" john@example.com password123 Customer
  node insert-user-cli.js "Chef Nimal" nimal@example.com chefpass123 Chef
        `);
    process.exit(1);
  }

  const [fullName, email, password, role = "Customer"] = args;

  const client = await pool.connect();

  try {
    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert user
    const result = await client.query(
      `INSERT INTO users (full_name, email, password_hash, role)
             VALUES ($1, $2, $3, $4)
             RETURNING uid, full_name, email, role`,
      [fullName, email, passwordHash, role],
    );

    console.log("✅ User inserted successfully:");
    console.log(result.rows[0]);
    console.log(`\n🔑 Login with:`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
  } catch (error) {
    if (error.code === "23505") {
      console.error("❌ Error: A user with this email already exists");
    } else {
      console.error("❌ Error inserting user:", error.message);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

insertUser();
