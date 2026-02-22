import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";

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

const startServer = async () => {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
