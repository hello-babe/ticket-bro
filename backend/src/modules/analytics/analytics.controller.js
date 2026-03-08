'use strict';
const asyncHandler = require('../../common/utils/asyncHandler');
const { sendSuccess } = require('../../common/utils/apiResponse');
class AnalyticsController {
  getOverview     = asyncHandler(async (req, res) => { sendSuccess(res, 'Overview.', { revenue: 0, tickets: 0, events: 0, attendees: 0 }); });
  getRevenue      = asyncHandler(async (req, res) => { sendSuccess(res, 'Revenue data.', { total: 0, monthly: [], weekly: [] }); });
  getTicketStats  = asyncHandler(async (req, res) => { sendSuccess(res, 'Ticket stats.', { sold: 0, available: 0, cancelled: 0 }); });
  getEventStats   = asyncHandler(async (req, res) => { sendSuccess(res, 'Event stats.', { total: 0, active: 0, upcoming: 0 }); });
  getEventAnalytics= asyncHandler(async (req, res) => { sendSuccess(res, 'Event analytics.', { id: req.params.id, views: 0, sales: 0 }); });
  getAudience     = asyncHandler(async (req, res) => { sendSuccess(res, 'Audience data.', { total: 0, newUsers: 0, returning: 0 }); });
}
module.exports = new AnalyticsController();
