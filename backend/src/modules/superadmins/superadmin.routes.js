// ============================================================
//  SUPERADMIN ROUTES — Full Complete
//  src/modules/superadmins/superadmin.routes.js
// ============================================================

const express = require("express");
const controller = require("./superadmin.controller");
const { verifyToken, requireRole } = require("../auth/auth.middleware");

const router = express.Router();

router.use(verifyToken);
router.use(requireRole("superadmin")); // STRICTLY superadmin only

// ─── ADMIN MANAGEMENT ────────────────────────────────────────
router.get("/admins", controller.getAllAdmins);
router.post("/admins/:userId/assign", controller.assignAdminRole);
router.delete("/admins/:userId/revoke", controller.revokeAdminRole);

// ─── PLATFORM ────────────────────────────────────────────────
router.get("/settings", controller.getPlatformSettings);
router.get("/audit-logs", controller.getFullAuditLog);
router.post("/force-logout-all", controller.forceLogoutAll);
router.get("/health", controller.getSystemHealth);

module.exports = router;
