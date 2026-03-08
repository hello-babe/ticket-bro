'use strict';
const asyncHandler = require('../../common/utils/asyncHandler');
const { sendSuccess } = require('../../common/utils/apiResponse');

class NotificationController {
  getNotifications  = asyncHandler(async (req, res) => { sendSuccess(res, 'Notifications fetched.', { notifications: [], unreadCount: 0 }); });
  getUnreadCount    = asyncHandler(async (req, res) => { sendSuccess(res, 'Unread count.', { count: 0 }); });
  markRead          = asyncHandler(async (req, res) => { sendSuccess(res, 'Marked as read.', { id: req.params.id }); });
  markAllRead       = asyncHandler(async (req, res) => { sendSuccess(res, 'All marked as read.'); });
  deleteNotification= asyncHandler(async (req, res) => { sendSuccess(res, 'Notification deleted.'); });
  clearAll          = asyncHandler(async (req, res) => { sendSuccess(res, 'All notifications cleared.'); });
  getPreferences    = asyncHandler(async (req, res) => { sendSuccess(res, 'Preferences fetched.', { email: true, push: true, sms: false }); });
  updatePreferences = asyncHandler(async (req, res) => { sendSuccess(res, 'Preferences updated.', req.body); });
  subscribePush     = asyncHandler(async (req, res) => { sendSuccess(res, 'Push subscribed.'); });
  unsubscribePush   = asyncHandler(async (req, res) => { sendSuccess(res, 'Push unsubscribed.'); });
}
module.exports = new NotificationController();
