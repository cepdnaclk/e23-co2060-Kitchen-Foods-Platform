import pool from "../src/config/db.js";

const updateSchema = async () => {
  try {
    console.log("Updating orders table schema...");
    
    // Add columns to orders table
    await pool.query(`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS food_item_id VARCHAR(255) REFERENCES food_items(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS chef_id VARCHAR(255) REFERENCES users(uid) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1,
      ADD COLUMN IF NOT EXISTS total_price DECIMAL(10,2),
      ADD COLUMN IF NOT EXISTS delivery_date DATE,
      ADD COLUMN IF NOT EXISTS delivery_time VARCHAR(50);
    `);
    
    console.log("Schema updated successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error updating schema:", err);
    process.exit(1);
  }
};

updateSchema();
