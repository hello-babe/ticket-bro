'use strict';

// backend/src/modules/users/user.service.js

const userRepository = require('./user.repository');
const path           = require('path');
const fs             = require('fs');

// ── Simple custom errors ───────────────────────────────────────────────────────
// Using plain Error subclasses — replace with your own AppError if you have one
class NotFoundError extends Error {
  constructor(msg) { super(msg); this.statusCode = 404; this.status = 'fail'; }
}
class BadRequestError extends Error {
  constructor(msg) { super(msg); this.statusCode = 400; this.status = 'fail'; }
}
class ForbiddenError extends Error {
  constructor(msg) { super(msg); this.statusCode = 403; this.status = 'fail'; }
}

class UserService {

  // ── Get user by ID ──────────────────────────────────────────────────────────
  async getUserById(id) {
    const user = await userRepository.findActiveById(id);
    if (!user) throw new NotFoundError('User not found.');
    return user.toSafeObject ? user.toSafeObject() : user.toObject();
  }

  // ── Update own profile ──────────────────────────────────────────────────────
  async updateUser(id, data) {
    // Strip fields the user is NOT allowed to change themselves
    const { role, isActive, isEmailVerified, deletedAt, password,
            googleId, facebookId, oauthProvider, loginAttempts, lockUntil,
            emailVerificationToken, passwordResetToken, ...safe } = data;

    const user = await userRepository.updateById(id, safe);
    if (!user) throw new NotFoundError('User not found.');
    return user.toSafeObject ? user.toSafeObject() : user.toObject();
  }

  // ── Deactivate own account (soft delete) ────────────────────────────────────
  async deactivateUser(id) {
    const user = await userRepository.softDeleteById(id);
    if (!user) throw new NotFoundError('User not found.');
    return user;
  }

  // ── Avatar ──────────────────────────────────────────────────────────────────
  async updateAvatar(id, file) {
    // file = multer file object { filename, path, mimetype, size }
    // If you use cloudinary/s3 you'd upload here and store the URL.
    // Default: store the local path / served URL.
    const avatarUrl = file.path || `/uploads/avatars/${file.filename}`;

    // Remove old avatar file if it was local
    const existing = await userRepository.findById(id, 'avatar');
    if (existing?.avatar && existing.avatar.startsWith('/uploads')) {
      const oldPath = path.join(process.cwd(), 'public', existing.avatar);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const user = await userRepository.updateById(id, { avatar: avatarUrl });
    if (!user) throw new NotFoundError('User not found.');
    return user.toSafeObject ? user.toSafeObject() : user.toObject();
  }

  async removeAvatar(id) {
    const existing = await userRepository.findById(id, 'avatar');
    if (existing?.avatar && existing.avatar.startsWith('/uploads')) {
      const oldPath = path.join(process.cwd(), 'public', existing.avatar);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    const user = await userRepository.updateById(id, { avatar: null });
    if (!user) throw new NotFoundError('User not found.');
    return user.toSafeObject ? user.toSafeObject() : user.toObject();
  }

  // ── Sessions ────────────────────────────────────────────────────────────────
  // Sessions are refresh tokens stored in DB (if your auth.service tracks them).
  // If you don't have a RefreshToken model yet, return empty array gracefully.
  async getActiveSessions(userId) {
    try {
      const RefreshToken = require('../auth/refreshToken.model');
      const sessions = await RefreshToken.find({ userId, isRevoked: false })
        .select('_id createdAt lastUsedAt device ip expiresAt')
        .sort('-lastUsedAt')
        .lean();
      return sessions;
    } catch {
      // RefreshToken model not yet created — return empty
      return [];
    }
  }

  async revokeSession(userId, sessionId) {
    try {
      const RefreshToken = require('../auth/refreshToken.model');
      const session = await RefreshToken.findOne({ _id: sessionId, userId });
      if (!session) throw new NotFoundError('Session not found.');
      session.isRevoked = true;
      await session.save();
    } catch (err) {
      if (err.statusCode) throw err;
      // Model not found — silently ignore
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ADMIN
  // ══════════════════════════════════════════════════════════════════════════

  async getAllUsers(query) {
    return userRepository.findAll(query);
  }

  async adminUpdateUser(id, data) {
    // Admin can change role, isActive, isEmailVerified etc.
    const { password, deletedAt, ...safe } = data;
    const user = await userRepository.updateById(id, safe);
    if (!user) throw new NotFoundError('User not found.');
    return user.toSafeObject ? user.toSafeObject() : user.toObject();
  }

  async hardDeleteUser(id) {
    const user = await userRepository.hardDeleteById(id);
    if (!user) throw new NotFoundError('User not found.');
  }

  async setUserActive(id, isActive) {
    const user = await userRepository.updateById(id, { isActive });
    if (!user) throw new NotFoundError('User not found.');
    return user.toSafeObject ? user.toSafeObject() : user.toObject();
  }

  async changeRole(id, role) {
    const validRoles = ['user', 'organizer', 'admin'];
    if (!validRoles.includes(role)) throw new BadRequestError(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
    const user = await userRepository.updateById(id, { role });
    if (!user) throw new NotFoundError('User not found.');
    return user.toSafeObject ? user.toSafeObject() : user.toObject();
  }

  async getUserStats() {
    return userRepository.getStats();
  }
}

module.exports = new UserService();
