'use strict';

const asyncHandler = require('../../common/utils/asyncHandler');
const { sendSuccess, sendCreated } = require('../../common/utils/apiResponse');
const { NotFoundError } = require('../../common/errors/AppError');

const getId = (user) => user?.id || user?._id || user?.userId;

class OrganizerController {
  getPublicProfile = asyncHandler(async (req, res) => {
    const organizerService = require('./organizer.service');
    const profile = await organizerService.getPublicProfile(req.params.slug);
    if (!profile) throw new NotFoundError('Organizer not found.');
    sendSuccess(res, 'Organizer profile fetched.', profile);
  });

  getPublicEvents = asyncHandler(async (req, res) => {
    const organizerService = require('./organizer.service');
    const events = await organizerService.getPublicEvents(req.params.slug, req.query);
    sendSuccess(res, 'Organizer events fetched.', events);
  });

  getOwnProfile = asyncHandler(async (req, res) => {
    const organizerService = require('./organizer.service');
    const profile = await organizerService.getOwnProfile(getId(req.user));
    sendSuccess(res, 'Profile fetched.', profile);
  });

  updateProfile = asyncHandler(async (req, res) => {
    const organizerService = require('./organizer.service');
    const profile = await organizerService.updateProfile(getId(req.user), req.body);
    sendSuccess(res, 'Profile updated.', profile);
  });

  submitVerification = asyncHandler(async (req, res) => {
    const organizerService = require('./organizer.service');
    const result = await organizerService.submitVerification(getId(req.user), req.body);
    sendCreated(res, 'Verification submitted.', result);
  });

  getVerificationStatus = asyncHandler(async (req, res) => {
    const organizerService = require('./organizer.service');
    const status = await organizerService.getVerificationStatus(getId(req.user));
    sendSuccess(res, 'Verification status fetched.', status);
  });

  getDashboard = asyncHandler(async (req, res) => {
    sendSuccess(res, 'Dashboard data.', { placeholder: true });
  });

  getMyEvents = asyncHandler(async (req, res) => {
    sendSuccess(res, 'Events fetched.', { placeholder: true });
  });

  getMyBookings = asyncHandler(async (req, res) => {
    sendSuccess(res, 'Bookings fetched.', { placeholder: true });
  });

  getRevenue = asyncHandler(async (req, res) => {
    sendSuccess(res, 'Revenue data.', { placeholder: true });
  });

  getPayouts = asyncHandler(async (req, res) => {
    sendSuccess(res, 'Payouts fetched.', { placeholder: true });
  });
}

module.exports = new OrganizerController();
