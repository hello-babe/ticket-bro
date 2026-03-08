'use strict';
const asyncHandler = require('../../common/utils/asyncHandler');
const { sendSuccess } = require('../../common/utils/apiResponse');
class AuditController {
  getLogs   = asyncHandler(async (req, res) => { sendSuccess(res, 'Audit logs fetched.', { logs: [], total: 0 }); });
  getById   = asyncHandler(async (req, res) => { sendSuccess(res, 'Log fetched.', { id: req.params.id }); });
  getByUser = asyncHandler(async (req, res) => { sendSuccess(res, 'User logs fetched.', { logs: [], userId: req.params.userId }); });
}
module.exports = new AuditController();
