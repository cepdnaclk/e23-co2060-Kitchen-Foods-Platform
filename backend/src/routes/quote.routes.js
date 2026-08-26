import express from "express";
import {
  submitQuote,
  getOrderQuotes,
  getChefQuotes,
} from "../controllers/quote.controller.js";

const router = express.Router();

router.post("/", submitQuote);
router.get("/order/:orderId", getOrderQuotes);
router.get("/chef/:chefId", getChefQuotes);

export default router;
