// ============================================================
//  SUPERADMIN CONTROLLER — Full Complete
//  src/modules/superadmins/superadmin.controller.js
// ============================================================

const superAdminService = require("./superadmin.service");
const asyncHandler = require("../../common/utils/asyncHandler");
const ApiResponse = require("../../common/utils/apiResponse");

class SuperAdminController {
  assignAdminRole = asyncHandler(async (req, res) => {
    const meta = { ip: req.ip };
    const result = await superAdminService.assignAdminRole(
      req.user._id,
      req.params.userId,
      meta,
    );
    return res.status(200).json(ApiResponse.success(result.message));
  });

  revokeAdminRole = asyncHandler(async (req, res) => {
    const meta = { ip: req.ip };
    const result = await superAdminService.revokeAdminRole(
      req.user._id,
      req.params.userId,
      meta,
    );
    return res.status(200).json(ApiResponse.success(result.message));
  });

  getAllAdmins = asyncHandler(async (req, res) => {
    const { page, limit } = req.query;
    const result = await superAdminService.getAllAdmins({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
    });
    return res.status(200).json(ApiResponse.success("All admins", result));
  });

  getPlatformSettings = asyncHandler(async (req, res) => {
    const data = await superAdminService.getPlatformSettings();
    return res.status(200).json(ApiResponse.success("Platform settings", data));
  });

  getFullAuditLog = asyncHandler(async (req, res) => {
    const { action, from, to, page, limit } = req.query;
    const result = await superAdminService.getFullAuditLog(
      { action, from, to },
      { page: Number(page) || 1, limit: Number(limit) || 100 },
    );
    return res.status(200).json(ApiResponse.success("Audit logs", result));
  });

  forceLogoutAll = asyncHandler(async (req, res) => {
    const meta = { ip: req.ip };
    const result = await superAdminService.forceLogoutAll(req.user._id, meta);
    return res.status(200).json(ApiResponse.success(result.message));
  });

  getSystemHealth = asyncHandler(async (req, res) => {
    const data = await superAdminService.getSystemHealth();
    return res.status(200).json(ApiResponse.success("System health", data));
  });
}

module.exports = new SuperAdminController();
