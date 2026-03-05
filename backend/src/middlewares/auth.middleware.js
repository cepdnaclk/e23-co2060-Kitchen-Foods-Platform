// src/middlewares/auth.middleware.js
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // look for header with typical casing and lowercase variant
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT verification failed", err);
      // give a slightly more specific message
      const message =
        err.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
      return res.status(403).json({ error: message });
    }

    req.user = decoded;
    next();
  });
};
