"use strict";

// backend/src/modules/users/avatar.service.js

const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

class AvatarService {
  constructor() {
    this.uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
    this.maxFileSize = 5 * 1024 * 1024; // 5MB
    this.allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    this.maxWidth = 500;
    this.quality = 85;
  }

  // ── Validate file ───────────────────────────────────────────────────────────
  validateFile(file) {
    if (!file) {
      throw new Error("No file provided");
    }
    if (!this.allowedTypes.includes(file.mimetype)) {
      throw new Error(
        "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed",
      );
    }
    if (file.size > this.maxFileSize) {
      throw new Error("File too large. Maximum size is 5MB");
    }
    return true;
  }

  // ── Generate filename ───────────────────────────────────────────────────────
  generateFilename(userId, originalName) {
    // Always save as .jpg for consistency (except PNG stays PNG)
    const originalExt = path.extname(originalName).toLowerCase();
    const ext = originalExt === ".png" ? ".png" : ".jpg";
    const timestamp = Date.now();
    return `avatar-${userId}-${timestamp}${ext}`;
  }

  // ── Process and save image ──────────────────────────────────────────────────
  async processAndSave(file, filename) {
    const inputPath = file.path;
    const outputPath = path.join(this.uploadDir, filename);

    if (!inputPath) {
      throw new Error("Uploaded file path is missing. Check multer config.");
    }

    try {
      // Ensure upload directory exists
      await fs.promises.mkdir(this.uploadDir, { recursive: true });

      // ✅ FIX: Build sharp pipeline based on mimetype — can't chain .jpeg() + .png() together
      let pipeline = sharp(inputPath).resize(this.maxWidth, null, {
        withoutEnlargement: true,
        fit: "inside",
      });

      if (file.mimetype === "image/png") {
        pipeline = pipeline.png({ compressionLevel: 6 });
      } else if (file.mimetype === "image/webp") {
        pipeline = pipeline.webp({ quality: this.quality });
      } else {
        // jpeg, gif → convert to jpeg
        pipeline = pipeline.jpeg({ quality: this.quality });
      }

      await pipeline.toFile(outputPath);

      // Remove original temp file
      await fs.promises.unlink(inputPath).catch(() => {}); // safe unlink

      return outputPath;
    } catch (error) {
      // Clean up on error
      await fs.promises.unlink(inputPath).catch(() => {});
      await fs.promises.unlink(outputPath).catch(() => {});
      throw new Error(`Failed to process image: ${error.message}`);
    }
  }

  // ── Delete old avatar ───────────────────────────────────────────────────────
  async deleteOldAvatar(avatarUrl) {
    if (!avatarUrl) return;

    let filename;
    try {
      if (avatarUrl.startsWith("http")) {
        const url = new URL(avatarUrl);
        filename = path.basename(url.pathname);
      } else if (avatarUrl.startsWith("/uploads/avatars/")) {
        filename = path.basename(avatarUrl);
      } else {
        return;
      }
    } catch {
      return; // Invalid URL — skip
    }

    const filePath = path.join(this.uploadDir, filename);
    try {
      await fs.promises.unlink(filePath);
    } catch (error) {
      // File might not exist — not a fatal error
      console.warn(`Could not delete old avatar (${filename}):`, error.message);
    }
  }

  // ── Get avatar URL ──────────────────────────────────────────────────────────
  getAvatarUrl(filename) {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    return `${backendUrl}/uploads/avatars/${filename}`;
  }

  // ── Check if avatar exists ──────────────────────────────────────────────────
  avatarExists(avatarUrl) {
    if (!avatarUrl) return false;

    let filename;
    try {
      if (avatarUrl.startsWith("http")) {
        const url = new URL(avatarUrl);
        filename = path.basename(url.pathname);
      } else if (avatarUrl.startsWith("/uploads/avatars/")) {
        filename = path.basename(avatarUrl);
      } else {
        return false;
      }
    } catch {
      return false;
    }

    const filePath = path.join(this.uploadDir, filename);
    return fs.existsSync(filePath);
  }
}

module.exports = new AvatarService();
