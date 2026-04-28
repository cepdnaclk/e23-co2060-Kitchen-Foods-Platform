import express from "express";
import {
  getPublicFoodCategories,
  getPublicFoodItems,
} from "../controllers/food.controller.js";

const router = express.Router();

router.get("/", getPublicFoodItems);
router.get("/categories", getPublicFoodCategories);

export default router;
