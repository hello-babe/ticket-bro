"use strict";

// backend/src/modules/users/user.service.js

const userRepository = require("./user.repository");
const avatarService = require("./avatar.service");
const fs = require("fs");

// ── Custom errors ─────────────────────────────────────────────────────────────
class NotFoundError extends Error {
  constructor(msg) {
    super(msg);
    this.statusCode = 404;
    this.status = "fail";
  }
}
class BadRequestError extends Error {
  constructor(msg) {
    super(msg);
    this.statusCode = 400;
    this.status = "fail";
  }
}

// ── Helper: extract userId safely ─────────────────────────────────────────────
const getId = (user) => user?.id || user?._id || user?.userId;

class UserService {
  // ── Get user by ID ──────────────────────────────────────────────────────────
  async getUserById(id) {
    const user = await userRepository.findActiveById(id);
    if (!user) throw new NotFoundError("User not found.");
    return user.toSafeObject ? user.toSafeObject() : user.toObject();
  }

  // ── Update own profile ──────────────────────────────────────────────────────
  async updateUser(id, data) {
    // Strip fields users cannot change themselves
    const {
      role,
      isActive,
      isEmailVerified,
      deletedAt,
      password,
      googleId,
      facebookId,
      oauthProvider,
      loginAttempts,
      lockUntil,
      emailVerificationToken,
      passwordResetToken,
      ...safe
    } = data;

    const user = await userRepository.updateById(id, safe);
    if (!user) throw new NotFoundError("User not found.");
    return user.toSafeObject ? user.toSafeObject() : user.toObject();
  }

  // ── Deactivate own account ──────────────────────────────────────────────────
  async deactivateUser(id) {
    const user = await userRepository.softDeleteById(id);
    if (!user) throw new NotFoundError("User not found.");
    return user;
  }

  // ── Avatar upload ───────────────────────────────────────────────────────────
  async updateAvatar(id, file) {
    // ✅ FIX: Guard — multer may not have attached a file
    if (!file) throw new BadRequestError("No file uploaded.");
    if (!file.path)
      throw new BadRequestError(
        "File path missing — check multer disk storage config.",
      );

    try {
      // 1. Validate
      avatarService.validateFile(file);

      // 2. Fetch existing avatar URL (only select the field we need)
      const existing = await userRepository.findById(id, "avatar");

      // 3. Generate new filename and process image
      const filename = avatarService.generateFilename(id, file.originalname);
      await avatarService.processAndSave(file, filename);

      // 4. Build URL
      const avatarUrl = avatarService.getAvatarUrl(filename);

      // 5. Delete old avatar AFTER new one is successfully saved
      if (existing?.avatar) {
        await avatarService.deleteOldAvatar(existing.avatar);
      }

      // 6. Persist to DB
      const user = await userRepository.updateById(id, { avatar: avatarUrl });
      if (!user) throw new NotFoundError("User not found.");

      return user.toSafeObject ? user.toSafeObject() : user.toObject();
    } catch (error) {
      // Clean up temp file if sharp hasn't already removed it
      if (file?.path) {
        fs.unlink(file.path, () => {}); // async, non-blocking
      }
      throw error;
    }
  }

  // ── Remove avatar ───────────────────────────────────────────────────────────
  async removeAvatar(id) {
    const existing = await userRepository.findById(id, "avatar");
    if (existing?.avatar) {
      await avatarService.deleteOldAvatar(existing.avatar);
    }
    const user = await userRepository.updateById(id, { avatar: null });
    if (!user) throw new NotFoundError("User not found.");
    return user.toSafeObject ? user.toSafeObject() : user.toObject();
  }

  // ── Sessions ────────────────────────────────────────────────────────────────
  async getActiveSessions(userId) {
    try {
      const RefreshToken = require("../auth/refreshToken.model");
      return await RefreshToken.find({ userId, isRevoked: false })
        .select("_id createdAt lastUsedAt device ip expiresAt")
        .sort("-lastUsedAt")
        .lean();
    } catch {
      return [];
    }
  }

  async revokeSession(userId, sessionId) {
    try {
      const RefreshToken = require("../auth/refreshToken.model");
      const session = await RefreshToken.findOne({ _id: sessionId, userId });
      if (!session) throw new NotFoundError("Session not found.");
      session.isRevoked = true;
      await session.save();
    } catch (err) {
      if (err.statusCode) throw err;
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ADMIN
  // ══════════════════════════════════════════════════════════════════════════

  async getAllUsers(query) {
    return userRepository.findAll(query);
  }

  async adminUpdateUser(id, data) {
    const { password, deletedAt, ...safe } = data;
    const user = await userRepository.updateById(id, safe);
    if (!user) throw new NotFoundError("User not found.");
    return user.toSafeObject ? user.toSafeObject() : user.toObject();
  }

  async hardDeleteUser(id) {
    const user = await userRepository.hardDeleteById(id);
    if (!user) throw new NotFoundError("User not found.");
  }

  async setUserActive(id, isActive) {
    const user = await userRepository.updateById(id, { isActive });
    if (!user) throw new NotFoundError("User not found.");
    return user.toSafeObject ? user.toSafeObject() : user.toObject();
  }

  async changeRole(id, role) {
    const validRoles = ["user", "organizer", "admin"];
    if (!validRoles.includes(role))
      throw new BadRequestError(
        `Invalid role. Must be one of: ${validRoles.join(", ")}`,
      );
    const user = await userRepository.updateById(id, { role });
    if (!user) throw new NotFoundError("User not found.");
    return user.toSafeObject ? user.toSafeObject() : user.toObject();
  }

  async getUserStats() {
    return userRepository.getStats();
  }
}

module.exports = new UserService();
