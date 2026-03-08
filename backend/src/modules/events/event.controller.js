'use strict';

// event.controller.js
// Full stub controller — replace service calls with real implementations.
// Every handler follows the standard { success, data } / { success, message } shape.

const asyncHandler = require('../../common/utils/asyncHandler');
const { sendSuccess, sendCreated } = require('../../common/utils/apiResponse');
const { NotFoundError, ForbiddenError } = require('../../common/errors/AppError');
const eventService = require('./event.service');

const getId = (user) => user?.id || user?._id || user?.userId;

class EventController {
  // ── Public ────────────────────────────────────────────────────────────────────
  getEvents = asyncHandler(async (req, res) => {
    const result = await eventService.getEvents(req.query, req.user);
    sendSuccess(res, 'Events fetched successfully.', result);
  });

  getFeaturedEvents = asyncHandler(async (req, res) => {
    const result = await eventService.getFeaturedEvents(req.query);
    sendSuccess(res, 'Featured events fetched.', result);
  });

  getTrendingEvents = asyncHandler(async (req, res) => {
    const result = await eventService.getTrendingEvents(req.query);
    sendSuccess(res, 'Trending events fetched.', result);
  });

  getUpcomingEvents = asyncHandler(async (req, res) => {
    const result = await eventService.getUpcomingEvents(req.query);
    sendSuccess(res, 'Upcoming events fetched.', result);
  });

  getEventBySlug = asyncHandler(async (req, res) => {
    const event = await eventService.getEventBySlug(req.params.slug, req.user);
    if (!event) throw new NotFoundError('Event not found.');
    sendSuccess(res, 'Event fetched.', event);
  });

  getEventDetails = asyncHandler(async (req, res) => {
    const event = await eventService.getEventDetails(req.params.slug, req.user);
    if (!event) throw new NotFoundError('Event not found.');
    sendSuccess(res, 'Event details fetched.', event);
  });

  getEventTickets = asyncHandler(async (req, res) => {
    const tickets = await eventService.getEventTickets(req.params.slug);
    sendSuccess(res, 'Tickets fetched.', tickets);
  });

  getEventReviews = asyncHandler(async (req, res) => {
    const reviews = await eventService.getEventReviews(req.params.slug, req.query);
    sendSuccess(res, 'Reviews fetched.', reviews);
  });

  getRelatedEvents = asyncHandler(async (req, res) => {
    const events = await eventService.getRelatedEvents(req.params.slug, req.query);
    sendSuccess(res, 'Related events fetched.', events);
  });

  getTicketTypes = asyncHandler(async (req, res) => {
    const types = await eventService.getTicketTypes(req.params.slug);
    sendSuccess(res, 'Ticket types fetched.', types);
  });

  getSeatSections = asyncHandler(async (req, res) => {
    const sections = await eventService.getSeatSections(req.params.slug);
    sendSuccess(res, 'Seat sections fetched.', sections);
  });

  getSeatMap = asyncHandler(async (req, res) => {
    const map = await eventService.getSeatMap(req.params.slug);
    sendSuccess(res, 'Seat map fetched.', map);
  });

  // ── Organizer ─────────────────────────────────────────────────────────────────
  createEvent = asyncHandler(async (req, res) => {
    const event = await eventService.createEvent(req.body, getId(req.user));
    sendCreated(res, 'Event created successfully.', event);
  });

  updateEvent = asyncHandler(async (req, res) => {
    const event = await eventService.updateEvent(req.params.slug, req.body, req.user);
    sendSuccess(res, 'Event updated.', event);
  });

  deleteEvent = asyncHandler(async (req, res) => {
    await eventService.deleteEvent(req.params.slug, req.user);
    sendSuccess(res, 'Event deleted.');
  });

  publishEvent = asyncHandler(async (req, res) => {
    const event = await eventService.publishEvent(req.params.slug, req.user);
    sendSuccess(res, 'Event published.', event);
  });

  cancelEvent = asyncHandler(async (req, res) => {
    const event = await eventService.cancelEvent(req.params.slug, req.user);
    sendSuccess(res, 'Event cancelled.', event);
  });

  createTicketType = asyncHandler(async (req, res) => {
    const type = await eventService.createTicketType(req.params.slug, req.body, req.user);
    sendCreated(res, 'Ticket type created.', type);
  });

  updateTicketType = asyncHandler(async (req, res) => {
    const type = await eventService.updateTicketType(req.params.slug, req.params.id, req.body, req.user);
    sendSuccess(res, 'Ticket type updated.', type);
  });

  deleteTicketType = asyncHandler(async (req, res) => {
    await eventService.deleteTicketType(req.params.slug, req.params.id, req.user);
    sendSuccess(res, 'Ticket type deleted.');
  });

  createSeatSection = asyncHandler(async (req, res) => {
    const section = await eventService.createSeatSection(req.params.slug, req.body, req.user);
    sendCreated(res, 'Seat section created.', section);
  });

  updateSeatSection = asyncHandler(async (req, res) => {
    const section = await eventService.updateSeatSection(req.params.slug, req.params.id, req.body, req.user);
    sendSuccess(res, 'Seat section updated.', section);
  });

  // ── Admin ─────────────────────────────────────────────────────────────────────
  adminGetAllEvents = asyncHandler(async (req, res) => {
    const result = await eventService.adminGetAllEvents(req.query);
    sendSuccess(res, 'All events fetched.', result);
  });

  approveEvent = asyncHandler(async (req, res) => {
    const event = await eventService.approveEvent(req.params.slug, req.user);
    sendSuccess(res, 'Event approved.', event);
  });

  rejectEvent = asyncHandler(async (req, res) => {
    const event = await eventService.rejectEvent(req.params.slug, req.body.reason, req.user);
    sendSuccess(res, 'Event rejected.', event);
  });
}

module.exports = new EventController();
