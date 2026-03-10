// ============================================================
//  MODERATOR SERVICE — Full Complete
//  src/modules/moderators/moderator.service.js
// ============================================================

const User = require("../users/user.model");
const AuditLog = require("../auditLogs/audit.model");

class ModeratorService {
  // ─── SUSPEND USER ──────────────────────────────────────────
  async suspendUser(moderatorId, targetUserId, reason, meta = {}) {
    const target = await User.findById(targetUserId);
    if (!target) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    // Cannot suspend staff — only admins/superadmins can do that
    const targetRoles = target.roles;
    const isStaff = targetRoles.some((r) =>
      ["moderator", "admin", "superadmin"].includes(r),
    );
    if (isStaff) {
      const err = new Error("Moderators cannot suspend staff members");
      err.statusCode = 403;
      throw err;
    }

    const previousStatus = target.status;

    await User.findByIdAndUpdate(targetUserId, {
      $set: {
        status: "suspended",
        statusReason: reason,
        statusUpdatedBy: moderatorId,
        statusUpdatedAt: new Date(),
      },
    });

    // Revoke all sessions
    const RefreshToken = require("../../infrastructure/tokens/RefreshToken");
    await RefreshToken.revokeAllForUser(targetUserId, "admin_revoke");

    await AuditLog.create({
      action: "user_suspended",
      module: "moderators",
      performedBy: moderatorId,
      performedByRole: "moderator",
      targetUser: targetUserId,
      targetEntity: "user",
      previousValue: { status: previousStatus },
      newValue: { status: "suspended", reason },
      reason,
      ip: meta.ip,
      timestamp: new Date(),
    });

    return { message: "User suspended successfully" };
  }

  // ─── UNSUSPEND USER ────────────────────────────────────────
  async unsuspendUser(moderatorId, targetUserId, meta = {}) {
    const target = await User.findById(targetUserId);
    if (!target) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    await User.findByIdAndUpdate(targetUserId, {
      $set: {
        status: "active",
        statusReason: "",
        statusUpdatedBy: moderatorId,
        statusUpdatedAt: new Date(),
      },
    });

    await AuditLog.create({
      action: "user_unsuspended",
      module: "moderators",
      performedBy: moderatorId,
      targetUser: targetUserId,
      previousValue: { status: "suspended" },
      newValue: { status: "active" },
      ip: meta.ip,
      timestamp: new Date(),
    });

    return { message: "User unsuspended successfully" };
  }

  // ─── WARN USER ─────────────────────────────────────────────
  async warnUser(moderatorId, targetUserId, warning, meta = {}) {
    const target = await User.findById(targetUserId);
    if (!target) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    // Store warning in metadata
    const warnings = JSON.parse(target.metadata?.get("warnings") || "[]");
    warnings.push({
      issuedBy: moderatorId,
      reason: warning,
      issuedAt: new Date(),
    });

    await User.findByIdAndUpdate(targetUserId, {
      $set: { "metadata.warnings": JSON.stringify(warnings) },
    });

    await AuditLog.create({
      action: "user_warned",
      module: "moderators",
      performedBy: moderatorId,
      targetUser: targetUserId,
      newValue: { warning },
      ip: meta.ip,
      timestamp: new Date(),
    });

    // TODO: send warning notification to user

    return { message: "Warning issued to user" };
  }

  // ─── GET REPORTS QUEUE ─────────────────────────────────────
  async getReportsQueue(filters = {}, pagination = {}) {
    const Report = require("../reports/report.model");

    const { status = "open", entityType } = filters;
    const { page = 1, limit = 20 } = pagination;

    const query = { status };
    if (entityType) query.entityType = entityType;

    const [reports, total] = await Promise.all([
      Report.find(query)
        .populate("reportedBy", "username profile.avatar")
        .populate("reportedUser", "username profile.avatar")
        .sort({ createdAt: 1 }) // oldest first
        .skip((page - 1) * limit)
        .limit(limit),
      Report.countDocuments(query),
    ]);

    return {
      reports,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  // ─── RESOLVE REPORT ────────────────────────────────────────
  async resolveReport(moderatorId, reportId, resolution, meta = {}) {
    const Report = require("../reports/report.model");

    const report = await Report.findById(reportId);
    if (!report) {
      const err = new Error("Report not found");
      err.statusCode = 404;
      throw err;
    }

    await Report.findByIdAndUpdate(reportId, {
      $set: {
        status: "resolved",
        reviewedBy: moderatorId,
        reviewedAt: new Date(),
        resolution: resolution.decision,
        resolutionNote: resolution.note,
        actionTaken: resolution.action,
      },
    });

    await AuditLog.create({
      action: "report_resolved",
      module: "moderators",
      performedBy: moderatorId,
      targetId: reportId,
      targetEntity: "report",
      newValue: resolution,
      ip: meta.ip,
      timestamp: new Date(),
    });

    return { message: "Report resolved" };
  }

  // ─── REVIEW EVENT ──────────────────────────────────────────
  async approveEvent(moderatorId, eventId, meta = {}) {
    const Event = require("../events/event.model");

    await Event.findByIdAndUpdate(eventId, {
      $set: {
        status: "published",
        approvedBy: moderatorId,
        approvedAt: new Date(),
      },
    });

    await AuditLog.create({
      action: "event_approved",
      module: "moderators",
      performedBy: moderatorId,
      targetId: eventId,
      targetEntity: "event",
      ip: meta.ip,
      timestamp: new Date(),
    });

    return { message: "Event approved and published" };
  }

  async rejectEvent(moderatorId, eventId, reason, meta = {}) {
    const Event = require("../events/event.model");

    await Event.findByIdAndUpdate(eventId, {
      $set: {
        status: "rejected",
        rejectedBy: moderatorId,
        rejectionReason: reason,
      },
    });

    await AuditLog.create({
      action: "event_rejected",
      module: "moderators",
      performedBy: moderatorId,
      targetId: eventId,
      targetEntity: "event",
      newValue: { reason },
      ip: meta.ip,
      timestamp: new Date(),
    });

    return { message: "Event rejected" };
  }

  // ─── GET PENDING EVENTS ────────────────────────────────────
  async getPendingEvents(pagination = {}) {
    const Event = require("../events/event.model");
    const { page = 1, limit = 20 } = pagination;

    const [events, total] = await Promise.all([
      Event.find({ status: "pending_approval" })
        .populate("organizerId", "username organizerProfile.organizationName")
        .sort({ createdAt: 1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Event.countDocuments({ status: "pending_approval" }),
    ]);

    return {
      events,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }
}

module.exports = new ModeratorService();
