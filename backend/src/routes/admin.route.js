import express from "express";
import adminController from "../controllers/admin.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import adminOnly from "../middlewares/admin.middleware.js";

const router = express.Router();

// Public admin auth endpoint.
router.post("/auth/login", adminController.adminLogin);

// Everything below this line requires a valid token AND Admin role.
router.use(verifyToken, adminOnly);

// --- Dashboard ---
router.get("/stats", adminController.getStats);
router.get("/dashboard/overview", adminController.getDashboardOverview);

// --- User Management ---
router.get("/users", adminController.getUsers);
router.post("/users", adminController.createUser); // If admin adds a user manually
router.put("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.removeUser);

// --- Food Item Management ---
router.get("/food", adminController.getFood);
router.post("/food", adminController.addFood);
router.put("/food/:id", adminController.updateFood);
router.delete("/food/:id", adminController.removeFood);

// --- Order & System Moderation ---
router.get("/orders", adminController.getOrders);
router.patch("/orders/:id", adminController.updateOrderStatus);
router.patch("/orders/:id/status", adminController.updateOrderStatus);
router.delete("/orders/:id", adminController.deleteOrder);

export default router;
