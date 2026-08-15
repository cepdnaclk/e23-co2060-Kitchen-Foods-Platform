import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";
import { errorHandler } from "./middlewares/errorHandler.js";
import { initDb } from "./config/initDb.js";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.route.js";
import foodRoutes from "./routes/food.routes.js";
import orderRoutes from "./routes/order.routes.js";
import quoteRoutes from "./routes/quote.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import Order from "./models/order.model.js";
import { UPLOADS_DIR } from "./middlewares/upload.middleware.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const openApiFilePath = path.resolve(__dirname, "../docs/openapi.json");



// Middlewares
app.use(express.json()); // parse the json bodies
app.use(cors()); // enable cross origin requests

// Serve uploaded images (see backend/uploads)
app.use(
  "/uploads",
  express.static(UPLOADS_DIR, {
    setHeaders: (res) => res.setHeader("X-Content-Type-Options", "nosniff"),
  }),
);

// Routes
// app.use("/api", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/api-docs/openapi.json", (req, res) => {
  res.sendFile(openApiFilePath);
});

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(null, {
    swaggerOptions: {
      url: "/api-docs/openapi.json",
    },
    explorer: true,
  }),
);

// Error handling middleware - should be after all routes
app.use(errorHandler);

const startServer = async () => {
  await initDb();
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

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

startServer().then(() => {
  runExpirySweep();
  setInterval(runExpirySweep, 60_000);
});
