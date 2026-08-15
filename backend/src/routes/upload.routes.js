// src/routes/upload.routes.js
import express from "express";
import multer from "multer";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { uploadImage } from "../middlewares/upload.middleware.js";

const router = express.Router();

// POST /api/upload — single image file under the "image" field name.
// Returns the public URL to store in e.g. food_items.image_url.
router.post(
  "/",
  verifyToken,
  uploadImage.single("image"),
  (req, res, next) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ error: "No image file provided (field name: 'image')" });
      }

      res.status(201).json({
        url: `/uploads/${req.file.filename}`,
        filename: req.file.filename,
      });
    } catch (err) {
      next(err);
    }
  },
);

// Multer / validation error handler (file too large, wrong type, ...)
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Image is too large (maximum 5MB)"
        : err.message;
    return res.status(400).json({ error: message });
  }
  if (err && err.statusCode) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  next(err);
});

export default router;
