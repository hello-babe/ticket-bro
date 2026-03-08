'use strict';
const asyncHandler = require('../../common/utils/asyncHandler');
const { sendSuccess } = require('../../common/utils/apiResponse');

class TicketController {
  getMyTickets    = asyncHandler(async (req, res) => { sendSuccess(res, 'Tickets fetched.', { tickets: [] }); });
  getTicketByCode = asyncHandler(async (req, res) => { sendSuccess(res, 'Ticket fetched.', { code: req.params.code }); });
  downloadTicket  = asyncHandler(async (req, res) => { sendSuccess(res, 'Download ready.', { url: `/tickets/${req.params.code}.pdf` }); });
  validateTicket  = asyncHandler(async (req, res) => { sendSuccess(res, 'Ticket validated.', { code: req.params.code, valid: true }); });
  transferTicket  = asyncHandler(async (req, res) => { sendSuccess(res, 'Ticket transferred.', { code: req.params.code }); });
  cancelTicket    = asyncHandler(async (req, res) => { sendSuccess(res, 'Ticket cancelled.', { code: req.params.code }); });
}
module.exports = new TicketController();
