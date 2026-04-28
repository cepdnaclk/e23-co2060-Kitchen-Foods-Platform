import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getUserByEmailService } from "../services/user.service.js";
import {
  addFoodService,
  createUserByAdminService,
  deleteOrderService,
  getDashboardOverviewService,
  getFoodService,
  getOrdersService,
  getStatsService,
  getUsersService,
  removeFoodService,
  removeUserByAdminService,
  updateFoodService,
  updateOrderStatusService,
  updateUserByAdminService,
} from "../services/admin.service.js";

const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const user = await getUserByEmailService(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (user.role !== "Admin") {
      return res
        .status(403)
        .json({ error: "Access Denied: Admin privileges required." });
    }

    const token = jwt.sign(
      { id: user.uid, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      message: "Admin logged in successfully",
      token,
      user: {
        uid: user.uid,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getStats = async (req, res, next) => {
  try {
    const stats = await getStatsService();
    res.json(stats);
  } catch (err) {
    next(err);
  }
};

const getDashboardOverview = async (req, res, next) => {
  try {
    const overview = await getDashboardOverviewService();
    res.json(overview);
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await getUsersService();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { full_name, email, password, role } = req.body;
    if (!full_name || !email || !password || !role) {
      return res
        .status(400)
        .json({ error: "full_name, email, password and role are required" });
    }

    const user = await createUserByAdminService({
      full_name,
      email,
      password,
      role,
    });

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await updateUserByAdminService(req.params.id, req.body);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const removeUser = async (req, res, next) => {
  try {
    const user = await removeUserByAdminService(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};

const getFood = async (req, res, next) => {
  try {
    const items = await getFoodService();
    res.json(items);
  } catch (err) {
    next(err);
  }
};

const addFood = async (req, res, next) => {
  try {
    const { name, description, price, chefId, imageUrl, categoryId } = req.body;
    if (
      !name ||
      !description ||
      price == null ||
      !chefId ||
      !imageUrl ||
      !categoryId
    ) {
      return res.status(400).json({
        error:
          "name, description, price, chefId, imageUrl and categoryId are required",
      });
    }

    const food = await addFoodService({
      name,
      description,
      price,
      chefId,
      imageUrl,
      categoryId,
    });

    res.status(201).json(food);
  } catch (err) {
    next(err);
  }
};

const updateFood = async (req, res, next) => {
  try {
    if (!req.body.categoryId) {
      return res.status(400).json({ error: "categoryId is required" });
    }
    const updated = await updateFoodService(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Food item not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

const removeFood = async (req, res, next) => {
  try {
    const removed = await removeFoodService(req.params.id);
    if (!removed) return res.status(404).json({ error: "Food item not found" });
    res.json({ message: "Food item deleted successfully" });
  } catch (err) {
    next(err);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await getOrdersService();
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const updated = await updateOrderStatusService(
      req.params.id,
      req.body.status,
    );
    if (!updated) return res.status(404).json({ error: "Order not found" });
    res.json(updated);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    next(err);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const deleted = await deleteOrderService(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export default {
  adminLogin,
  getStats,
  getDashboardOverview,
  getUsers,
  createUser,
  updateUser,
  removeUser,
  getFood,
  addFood,
  updateFood,
  removeFood,
  getOrders,
  updateOrderStatus,
  deleteOrder,
};
