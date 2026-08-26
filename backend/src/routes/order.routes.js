import express from "express";
import {
  createOrder,
  claimOrder,
  getChefOrders,
  getCustomerOrders,
  updateOrderStatus,
  acceptQuote,
  cancelOrder,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/chef/:chefId", getChefOrders);
router.get("/customer/:customerId", getCustomerOrders);
router.patch("/:orderId/claim", claimOrder);
router.patch("/:orderId/status", updateOrderStatus);
router.post("/:orderId/accept", acceptQuote);
router.patch("/:orderId/cancel", cancelOrder);

export default router;
