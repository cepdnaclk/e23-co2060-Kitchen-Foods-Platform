import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorHandler.js";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

dotenv.config({
  path: "./.env",
});

// Middlewares
app.use(express.json()); // parse the json bodies
app.use(cors()); // enable cross origin requests

// Routes
// app.use("/api", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Create tables on server start
// createUserTable();

// Error handling middleware - should be after all routes
app.use(errorHandler);

const startServer = async () => {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
