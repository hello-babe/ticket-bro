// ============================================================
//  MODERATOR CONTROLLER — Full Complete
//  src/modules/moderators/moderator.controller.js
// ============================================================

const moderatorService = require("./moderator.service");
const asyncHandler = require("../../common/utils/asyncHandler");
const ApiResponse = require("../../common/utils/apiResponse");

class ModeratorController {
  suspendUser = asyncHandler(async (req, res) => {
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json(ApiResponse.error("Reason required", 400));
    }
    const meta = { ip: req.ip };
    const result = await moderatorService.suspendUser(
      req.user._id,
      req.params.userId,
      reason,
      meta,
    );
    return res.status(200).json(ApiResponse.success(result.message));
  });

  unsuspendUser = asyncHandler(async (req, res) => {
    const meta = { ip: req.ip };
    const result = await moderatorService.unsuspendUser(
      req.user._id,
      req.params.userId,
      meta,
    );
    return res.status(200).json(ApiResponse.success(result.message));
  });

  warnUser = asyncHandler(async (req, res) => {
    const { warning } = req.body;
    if (!warning) {
      return res
        .status(400)
        .json(ApiResponse.error("Warning message required", 400));
    }
    const meta = { ip: req.ip };
    const result = await moderatorService.warnUser(
      req.user._id,
      req.params.userId,
      warning,
      meta,
    );
    return res.status(200).json(ApiResponse.success(result.message));
  });

  getReportsQueue = asyncHandler(async (req, res) => {
    const { status, entityType, page, limit } = req.query;
    const result = await moderatorService.getReportsQueue(
      { status, entityType },
      { page: Number(page) || 1, limit: Number(limit) || 20 },
    );
    return res.status(200).json(ApiResponse.success("Reports queue", result));
  });

  resolveReport = asyncHandler(async (req, res) => {
    const meta = { ip: req.ip };
    const result = await moderatorService.resolveReport(
      req.user._id,
      req.params.reportId,
      req.body,
      meta,
    );
    return res.status(200).json(ApiResponse.success(result.message));
  });

  getPendingEvents = asyncHandler(async (req, res) => {
    const { page, limit } = req.query;
    const result = await moderatorService.getPendingEvents({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
    });
    return res.status(200).json(ApiResponse.success("Pending events", result));
  });

  approveEvent = asyncHandler(async (req, res) => {
    const meta = { ip: req.ip };
    const result = await moderatorService.approveEvent(
      req.user._id,
      req.params.eventId,
      meta,
    );
    return res.status(200).json(ApiResponse.success(result.message));
  });

  rejectEvent = asyncHandler(async (req, res) => {
    const { reason } = req.body;
    if (!reason) {
      return res
        .status(400)
        .json(ApiResponse.error("Rejection reason required", 400));
    }
    const meta = { ip: req.ip };
    const result = await moderatorService.rejectEvent(
      req.user._id,
      req.params.eventId,
      reason,
      meta,
    );
    return res.status(200).json(ApiResponse.success(result.message));
  });
}

module.exports = new ModeratorController();
