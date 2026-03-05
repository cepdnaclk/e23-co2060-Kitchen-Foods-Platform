import {
  getAllUsersService,
  getUserByIdService,
  updateUserByIdService,
  deleteUserByIdService,
} from "../services/user.service.js";

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
