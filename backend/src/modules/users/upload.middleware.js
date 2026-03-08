"use strict";

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Upload folder
const UPLOADS_FOLDER = path.join(process.cwd(), "public", "uploads", "avatars");

// Ensure folder exists
if (!fs.existsSync(UPLOADS_FOLDER)) {
  fs.mkdirSync(UPLOADS_FOLDER, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_FOLDER);
  },
  filename: function (req, file, cb) {
    // Make filename unique: timestamp + original name
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const safeName = name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "");
    cb(null, `${safeName}-${Date.now()}${ext}`);
  },
});

// File filter
function fileFilter(req, file, cb) {
  // Accept only images
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
}

// Multer upload
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB max
  },
});

module.exports = upload;
