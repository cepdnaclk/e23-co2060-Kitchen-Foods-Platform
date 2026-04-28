import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", getAllUsers);
router.get("/:uid", getUserById);
router.put("/:uid", updateUser);
router.delete("/:uid", deleteUser);

export default router;
