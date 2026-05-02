import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";
import { errorHandler } from "./middlewares/errorHandler.js";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.route.js";
import foodRoutes from "./routes/food.routes.js";
import orderRoutes from "./routes/order.routes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const openApiFilePath = path.resolve(__dirname, "../docs/openapi.json");

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
app.use("/api/admin", adminRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/orders", orderRoutes);

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
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
