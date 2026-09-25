import {
  getAllUsersService,
  getUserByIdService,
  updateUserByIdService,
  deleteUserByIdService,
} from "../services/user.service.js";
import pool from "../config/db.js";

export const getAllUsers = async (req, res) => {
  const users = await getAllUsersService();
  res.json(users);
};

export const getUserById = async (req, res) => {
  const user = await getUserByIdService(req.params.uid);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
};

export const updateUser = async (req, res) => {
  const user = await updateUserByIdService(
    req.params.uid,
    req.body.full_name,
    req.body.email,
    req.body.role,
  );
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
};

export const deleteUser = async (req, res) => {
  const user = await deleteUserByIdService(req.params.uid);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ message: "User deleted successfully" });
};

export const updateUserLocation = async (req, res) => {
  try {
    const { uid } = req.params;
    const { latitude, longitude } = req.body;

    if (latitude == null || longitude == null) {
      return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: "Invalid coordinate numbers" });
    }

    const chefRes = await pool.query(
      "UPDATE chefs SET latitude = $1, longitude = $2 WHERE uid = $3 RETURNING uid, full_name, email, role, latitude, longitude",
      [lat, lng, uid]
    );

    if (chefRes.rows.length > 0) {
      return res.json({ message: "Chef location updated successfully", chef: chefRes.rows[0] });
    }

    return res.status(404).json({ error: "Chef profile not found" });
  } catch (err) {
    console.error("Error updating location:", err);
    res.status(500).json({ error: "Failed to update location" });
  }
};
