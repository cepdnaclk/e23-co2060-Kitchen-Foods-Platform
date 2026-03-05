// src/controllers/auth.controller.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createUserService,
  getUserByEmailService,
} from "../services/user.service.js";

export const userRegister = async (req, res) => {
  try {
    const { full_name, email, password, role } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUserService(full_name, email, passwordHash, role);
    res.status(201).json({ message: "User registered", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during registration" });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await getUserByEmailService(email);

    if (!result)
      return res.status(401).json({ error: "Invalid email or password" });

    const user = result;
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { id: user.uid, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      message: "Logged in successfully",
      token,
      user: { uid: user.uid, full_name: user.full_name, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during login" });
  }
};
