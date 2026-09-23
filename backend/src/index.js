import app from "./app.js";
import pool from "./config/db.js";
import { initDb } from "./config/initDb.js";
import Order from "./models/order.model.js";

// Bidding-engine expiry sweep: Pending orders past their expires_at become
// Expired and their active quotes are voided. Runs on startup and then
// every minute; feed reads also sweep lazily as a safety net.
const runExpirySweep = async () => {
  try {
    const expired = await Order.expireOverdue();
    if (expired > 0) console.log(`Expiry sweep: expired ${expired} order(s)`);
  } catch (err) {
    console.error("Expiry sweep failed:", err.message);
  }
};

const startServer = async () => {
 if (process.env.NODE_ENV === "production") {
    const { initDbProd } = await import("./config/initDb.prod.js");
    await initDbProd(pool);
  } else {
    await initDb();
  }
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);

  });

  // Only schedule the sweep after a successful wipe+seed, so the first
  // tick never races DROP SCHEMA and hits a missing relation.
  runExpirySweep();
  setInterval(runExpirySweep, 60_000);
};

startServer();
