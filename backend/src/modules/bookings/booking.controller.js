'use strict';
const asyncHandler = require('../../common/utils/asyncHandler');
const { sendSuccess, sendCreated } = require('../../common/utils/apiResponse');
const getId = u => u?.id || u?._id?.toString() || u?.userId;

class BookingController {
  createBooking = asyncHandler(async (req, res) => {
    sendCreated(res, 'Booking created.', { bookingRef: `BK-${Date.now()}`, ...req.body, userId: getId(req.user) });
  });
  getMyBookings = asyncHandler(async (req, res) => {
    sendSuccess(res, 'Bookings fetched.', { bookings: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 0 } });
  });
  getBookingByRef = asyncHandler(async (req, res) => {
    sendSuccess(res, 'Booking fetched.', { ref: req.params.ref });
  });
  cancelBooking = asyncHandler(async (req, res) => {
    sendSuccess(res, 'Booking cancelled.', { ref: req.params.ref, status: 'cancelled' });
  });
  requestRefund = asyncHandler(async (req, res) => {
    sendSuccess(res, 'Refund requested.', { ref: req.params.ref });
  });
  getBookingTickets = asyncHandler(async (req, res) => {
    sendSuccess(res, 'Tickets fetched.', { tickets: [] });
  });
  getInvoice = asyncHandler(async (req, res) => {
    sendSuccess(res, 'Invoice fetched.', { ref: req.params.ref });
  });
  getOrganizerBookings = asyncHandler(async (req, res) => {
    sendSuccess(res, 'Organizer bookings fetched.', { bookings: [] });
  });
  checkIn = asyncHandler(async (req, res) => {
    sendSuccess(res, 'Checked in.', { ref: req.params.ref, checkedIn: true });
  });
}
module.exports = new BookingController();
