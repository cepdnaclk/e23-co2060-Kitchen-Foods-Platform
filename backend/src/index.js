import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import userRoutes from "./routes/user.route.js";
import createUserTable from "./data/createUserTable.js";

const app = express();

dotenv.config({
  path: "./.env",
});

// Middlewares
app.use(express.json()); // parse the json bodies
app.use(cors()); // enable cross origin requests

// Testing POSTGRES connection
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.send(`The time from the database is ${result.rows[0].now}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database connection error" });
  }
});

// Routes
app.use("/api", userRoutes);

// Error handling middleware - should be after all routes
app.use(errorHandler);

// Create tables on server start
createUserTable();

const startServer = async () => {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
