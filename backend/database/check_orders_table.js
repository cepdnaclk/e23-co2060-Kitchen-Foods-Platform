import pool from "../src/config/db.js";

const checkTable = async () => {
  try {
    const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'orders';
    `);
    console.log("Orders table columns:", res.rows);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkTable();
