// ============================================================
//  MODERATOR ROUTES — Full Complete
//  src/modules/moderators/moderator.routes.js
// ============================================================

const express = require("express");
const controller = require("./moderator.controller");
const {
  verifyToken,
  requireRole,
  requirePermission,
} = require("../auth/auth.middleware");

const router = express.Router();

router.use(verifyToken);
router.use(requireRole("moderator", "admin", "superadmin"));

// ─── USER MODERATION ─────────────────────────────────────────
router.post(
  "/users/:userId/suspend",
  requirePermission("moderator:suspend_user"),
  controller.suspendUser,
);
router.post(
  "/users/:userId/unsuspend",
  requirePermission("moderator:suspend_user"),
  controller.unsuspendUser,
);
router.post(
  "/users/:userId/warn",
  requirePermission("moderator:warn_user"),
  controller.warnUser,
);

// ─── REPORTS ─────────────────────────────────────────────────
router.get(
  "/reports",
  requirePermission("moderator:view_reports"),
  controller.getReportsQueue,
);
router.put(
  "/reports/:reportId/resolve",
  requirePermission("moderator:resolve_report"),
  controller.resolveReport,
);

// ─── EVENT REVIEW ─────────────────────────────────────────────
router.get(
  "/events/pending",
  requirePermission("moderator:review_events"),
  controller.getPendingEvents,
);
router.post(
  "/events/:eventId/approve",
  requirePermission("moderator:approve_event"),
  controller.approveEvent,
);
router.post(
  "/events/:eventId/reject",
  requirePermission("moderator:reject_event"),
  controller.rejectEvent,
);

module.exports = router;
