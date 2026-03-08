'use strict';

const asyncHandler = require('../../common/utils/asyncHandler');
const { sendSuccess } = require('../../common/utils/apiResponse');

// Stub controller — wire up to real services as you build them out
class AdminController {
  getDashboard = asyncHandler(async (req, res) => {
    sendSuccess(res, 'Admin dashboard data.', { placeholder: true });
  });

  getSystemHealth = asyncHandler(async (req, res) => {
    sendSuccess(res, 'System health OK.', { status: 'ok', uptime: process.uptime() });
  });

  getSystemMetrics = asyncHandler(async (req, res) => {
    sendSuccess(res, 'System metrics.', { placeholder: true });
  });

  getFeatureFlags = asyncHandler(async (req, res) => {
    sendSuccess(res, 'Feature flags.', {});
  });

  updateFeatureFlags = asyncHandler(async (req, res) => {
    sendSuccess(res, 'Feature flags updated.', req.body);
  });

  // User management
  getAllUsers = asyncHandler(async (req, res) => {
    const userService = require('../users/user.service');
    const result = await userService.getAllUsers(req.query);
    sendSuccess(res, 'Users fetched.', result);
  });

  getUserById = asyncHandler(async (req, res) => {
    const userService = require('../users/user.service');
    const user = await userService.getUserById(req.params.id);
    sendSuccess(res, 'User fetched.', user);
  });

  updateUser = asyncHandler(async (req, res) => {
    const userService = require('../users/user.service');
    const user = await userService.adminUpdateUser(req.params.id, req.body);
    sendSuccess(res, 'User updated.', user);
  });

  deleteUser = asyncHandler(async (req, res) => {
    const userService = require('../users/user.service');
    await userService.hardDeleteUser(req.params.id);
    sendSuccess(res, 'User deleted.');
  });

  banUser = asyncHandler(async (req, res) => {
    const userService = require('../users/user.service');
    const user = await userService.setUserActive(req.params.id, false);
    sendSuccess(res, 'User banned.', user);
  });

  unbanUser = asyncHandler(async (req, res) => {
    const userService = require('../users/user.service');
    const user = await userService.setUserActive(req.params.id, true);
    sendSuccess(res, 'User unbanned.', user);
  });

  changeUserRole = asyncHandler(async (req, res) => {
    const userService = require('../users/user.service');
    const user = await userService.changeRole(req.params.id, req.body.role);
    sendSuccess(res, 'User role updated.', user);
  });

  // Organizers
  getAllOrganizers = asyncHandler(async (req, res) => {
    sendSuccess(res, 'Organizers fetched.', { placeholder: true });
  });

  getOrganizerById = asyncHandler(async (req, res) => {
    sendSuccess(res, 'Organizer fetched.', { id: req.params.id });
  });

  verifyOrganizer = asyncHandler(async (req, res) => {
    sendSuccess(res, 'Organizer verified.', { id: req.params.id });
  });

  rejectOrganizer = asyncHandler(async (req, res) => {
    sendSuccess(res, 'Organizer rejected.', { id: req.params.id });
  });

  suspendOrganizer = asyncHandler(async (req, res) => {
    sendSuccess(res, 'Organizer suspended.', { id: req.params.id });
  });

  // Bookings
  getAllBookings = asyncHandler(async (req, res) => {
    sendSuccess(res, 'Bookings fetched.', { placeholder: true });
  });

  cancelBooking = asyncHandler(async (req, res) => {
    sendSuccess(res, 'Booking cancelled.', { ref: req.params.ref });
  });

  refundBooking = asyncHandler(async (req, res) => {
    sendSuccess(res, 'Booking refunded.', { ref: req.params.ref });
  });

  // Payments
  getAllPayments = asyncHandler(async (req, res) => {
    sendSuccess(res, 'Payments fetched.', { placeholder: true });
  });

  getPaymentById = asyncHandler(async (req, res) => {
    sendSuccess(res, 'Payment fetched.', { id: req.params.id });
  });

  refundPayment = asyncHandler(async (req, res) => {
    sendSuccess(res, 'Payment refunded.', { id: req.params.id });
  });

  // Reviews
  getAllReviews = asyncHandler(async (req, res) => {
    sendSuccess(res, 'Reviews fetched.', { placeholder: true });
  });

  deleteReview = asyncHandler(async (req, res) => {
    sendSuccess(res, 'Review deleted.', { id: req.params.id });
  });

  flagReview = asyncHandler(async (req, res) => {
    sendSuccess(res, 'Review flagged.', { id: req.params.id });
  });

  // Analytics
  getAnalyticsOverview = asyncHandler(async (req, res) => {
    sendSuccess(res, 'Analytics overview.', { placeholder: true });
  });

  getRevenueAnalytics = asyncHandler(async (req, res) => {
    sendSuccess(res, 'Revenue analytics.', { placeholder: true });
  });

  getUserAnalytics = asyncHandler(async (req, res) => {
    sendSuccess(res, 'User analytics.', { placeholder: true });
  });

  getEventAnalytics = asyncHandler(async (req, res) => {
    sendSuccess(res, 'Event analytics.', { placeholder: true });
  });

  getOrganizerAnalytics = asyncHandler(async (req, res) => {
    sendSuccess(res, 'Organizer analytics.', { placeholder: true });
  });

  // Promotions
  getAllPromotions = asyncHandler(async (req, res) => {
    sendSuccess(res, 'Promotions fetched.', { placeholder: true });
  });

  disablePromotion = asyncHandler(async (req, res) => {
    sendSuccess(res, 'Promotion disabled.', { id: req.params.id });
  });
}

module.exports = new AdminController();
