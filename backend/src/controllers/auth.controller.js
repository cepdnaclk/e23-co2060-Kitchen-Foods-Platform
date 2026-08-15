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

    // Chefs are created in a "Pending" state and must be approved by an admin
    // before they can sign in.
    const message =
      role === "Chef"
        ? "Chef account created. It will be active once an admin approves your application."
        : "User registered";
    res.status(201).json({ message, user });
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

    // Chefs must be approved by an admin before they can access the system.
    if (user.role === "Chef" && user.approval_status !== "Approved") {
      if (user.approval_status === "Rejected") {
        return res
          .status(403)
          .json({ error: "Your chef application was rejected. Please contact support." });
      }
      return res
        .status(403)
        .json({ error: "Your chef account is awaiting admin approval. Please try again later." });
    }

    const token = jwt.sign(
      { id: user.uid, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      message: "Logged in successfully",
      token,
      user: {
        uid: user.uid,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        approval_status: user.approval_status,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during login" });
  }
};
