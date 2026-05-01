import pool from "../src/config/db.js";

const updateConstraint = async () => {
  try {
    console.log("Updating orders table status constraint...");
    
    // First, find the constraint name
    const constraintRes = await pool.query(`
      SELECT conname 
      FROM pg_constraint 
      WHERE conrelid = 'orders'::regclass AND contype = 'c' AND conname LIKE '%status%';
    `);
    
    if (constraintRes.rows.length > 0) {
      const constraintName = constraintRes.rows[0].conname;
      console.log(`Dropping constraint: ${constraintName}`);
      await pool.query(`ALTER TABLE orders DROP CONSTRAINT ${constraintName}`);
    }
    
    // Add new expanded constraint
    await pool.query(`
      ALTER TABLE orders 
      ADD CONSTRAINT orders_status_check 
      CHECK (status IN ('Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled', 'Quoted', 'Paid', 'Completed'));
    `);
    
    console.log("Constraint updated successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error updating constraint:", err);
    process.exit(1);
  }
};

updateConstraint();
