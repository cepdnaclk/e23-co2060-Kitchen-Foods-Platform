// src/middlewares/upload.middleware.js
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Uploads live in backend/uploads (one level up from src/middlewares)
export const UPLOADS_DIR = path.resolve(__dirname, "../../uploads");

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

// Extension is derived from the allowlisted MIME type, never from the
// client-supplied filename — prevents serving attacker-controlled HTML/JS
// (e.g. an HTML file uploaded with a spoofed `Content-Type: image/png`).
const EXT_BY_MIME = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = EXT_BY_MIME[file.mimetype] ?? ".jpg";
    const unique = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}`;
    cb(null, `${unique}${ext}`);
  },
});

export const uploadImage = multer({
  storage,
  limits: { fileSize: MAX_IMAGE_SIZE },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
      return cb(null, true);
    }
    const err = new Error(
      "Only image files are allowed (JPEG, PNG, WebP, GIF, AVIF)",
    );
    err.statusCode = 400;
    cb(err);
  },
});
