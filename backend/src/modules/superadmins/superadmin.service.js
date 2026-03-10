// ============================================================
//  SUPERADMIN SERVICE — Full Complete
//  src/modules/superadmins/superadmin.service.js
// ============================================================

const User = require("../users/user.model");
const AuditLog = require("../auditLogs/audit.model");

class SuperAdminService {
  // ─── ASSIGN ADMIN ROLE ─────────────────────────────────────
  async assignAdminRole(superAdminId, targetUserId, meta = {}) {
    const target = await User.findById(targetUserId);
    if (!target) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    if (!target.roles.includes("admin")) {
      target.roles.push("admin");
      await target.save();
    }

    await AuditLog.create({
      action: "admin_role_assigned",
      module: "superadmins",
      performedBy: superAdminId,
      targetUser: targetUserId,
      newValue: { role: "admin" },
      ip: meta.ip,
      timestamp: new Date(),
    });

    return { message: "Admin role assigned" };
  }

  // ─── REVOKE ADMIN ROLE ─────────────────────────────────────
  async revokeAdminRole(superAdminId, targetUserId, meta = {}) {
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { roles: "admin" },
    });

    await AuditLog.create({
      action: "admin_role_revoked",
      module: "superadmins",
      performedBy: superAdminId,
      targetUser: targetUserId,
      ip: meta.ip,
      timestamp: new Date(),
    });

    return { message: "Admin role revoked" };
  }

  // ─── GET ALL ADMINS ────────────────────────────────────────
  async getAllAdmins(pagination = {}) {
    const { page = 1, limit = 20 } = pagination;

    const [admins, total] = await Promise.all([
      User.find({ roles: "admin", isDeleted: false })
        .select("username email profile status createdAt lastLoginAt")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      User.countDocuments({ roles: "admin", isDeleted: false }),
    ]);

    return {
      admins,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  // ─── PLATFORM SETTINGS ─────────────────────────────────────
  async getPlatformSettings() {
    // In a real app, store in a Settings model or Redis
    // For now return env-based config summary
    return {
      maintenanceMode: process.env.MAINTENANCE_MODE === "true",
      registrationOpen: process.env.REGISTRATION_OPEN !== "false",
      maxLoginAttempts: Number(process.env.MAX_LOGIN_ATTEMPTS) || 5,
      sessionTimeout: process.env.SESSION_TIMEOUT || "30d",
      defaultCurrency: process.env.DEFAULT_CURRENCY || "USD",
      platformFeeRate: Number(process.env.PLATFORM_FEE_RATE) || 10,
    };
  }

  // ─── FULL AUDIT LOG ACCESS ─────────────────────────────────
  async getFullAuditLog(filters = {}, pagination = {}) {
    const { page = 1, limit = 100 } = pagination;

    const query = {};
    if (filters.action) query.action = filters.action;
    if (filters.from || filters.to) {
      query.timestamp = {};
      if (filters.from) query.timestamp.$gte = new Date(filters.from);
      if (filters.to) query.timestamp.$lte = new Date(filters.to);
    }

    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .populate("performedBy", "username email roles")
        .populate("targetUser", "username email roles")
        .sort({ timestamp: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      AuditLog.countDocuments(query),
    ]);

    return {
      logs,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  // ─── FORCE LOGOUT ALL USERS ────────────────────────────────
  async forceLogoutAll(superAdminId, meta = {}) {
    const RefreshToken = require("../../infrastructure/tokens/RefreshToken");
    await RefreshToken.updateMany(
      { isActive: true },
      {
        $set: {
          isActive: false,
          revokedAt: new Date(),
          revokedReason: "admin_revoke",
        },
      },
    );

    await AuditLog.create({
      action: "force_logout_all_users",
      module: "superadmins",
      performedBy: superAdminId,
      ip: meta.ip,
      timestamp: new Date(),
    });

    return { message: "All active sessions have been terminated" };
  }

  // ─── SYSTEM HEALTH OVERVIEW ────────────────────────────────
  async getSystemHealth() {
    const mongoose = require("mongoose");
    const os = require("os");

    const dbState = mongoose.connection.readyState;
    const dbStatus =
      ["disconnected", "connected", "connecting", "disconnecting"][dbState] ||
      "unknown";

    return {
      uptime: process.uptime(),
      timestamp: new Date(),
      database: { status: dbStatus },
      memory: {
        total: os.totalmem(),
        free: os.freemem(),
        usage: process.memoryUsage(),
      },
      cpu: {
        model: os.cpus()[0]?.model,
        cores: os.cpus().length,
      },
      node: process.version,
      env: process.env.NODE_ENV,
    };
  }
}

module.exports = new SuperAdminService();

// ============================================================
//  SUPERADMIN CONTROLLER
//  src/modules/superadmins/superadmin.controller.js
// ============================================================
