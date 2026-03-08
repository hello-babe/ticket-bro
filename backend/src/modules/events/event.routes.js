'use strict';

const express = require('express');
const router = express.Router();

const { authenticate, authorize, optionalAuth } = require('../../common/middleware/auth.middleware');
const { cache } = require('../../common/middleware/cache.middleware');
const { ROLES } = require('../../common/constants/roles');

// Lazy-load controller
let _ctrl;
const ctrl = () => { if (!_ctrl) _ctrl = require('./event.controller'); return _ctrl; };

// ════════════════════════════════════════════════════════════════════════════════
// PUBLIC ROUTES
// ════════════════════════════════════════════════════════════════════════════════
router.get('/',          optionalAuth, cache('2m'),  (req, res, next) => ctrl().getEvents(req, res, next));
router.get('/featured',               cache('5m'),  (req, res, next) => ctrl().getFeaturedEvents(req, res, next));
router.get('/trending',               cache('5m'),  (req, res, next) => ctrl().getTrendingEvents(req, res, next));
router.get('/upcoming',               cache('5m'),  (req, res, next) => ctrl().getUpcomingEvents(req, res, next));

// Admin-scoped read — must be before :slug to avoid route collision
router.get('/admin/all',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  (req, res, next) => ctrl().adminGetAllEvents(req, res, next));

router.get('/:slug',            optionalAuth, cache('2m'),  (req, res, next) => ctrl().getEventBySlug(req, res, next));
router.get('/:slug/details',    optionalAuth, cache('1m'),  (req, res, next) => ctrl().getEventDetails(req, res, next));
router.get('/:slug/tickets',                 cache('1m'),  (req, res, next) => ctrl().getEventTickets(req, res, next));
router.get('/:slug/reviews',                               (req, res, next) => ctrl().getEventReviews(req, res, next));
router.get('/:slug/related',                 cache('5m'),  (req, res, next) => ctrl().getRelatedEvents(req, res, next));
router.get('/:slug/ticket-types',                          (req, res, next) => ctrl().getTicketTypes(req, res, next));
router.get('/:slug/seat-sections',                         (req, res, next) => ctrl().getSeatSections(req, res, next));
router.get('/:slug/seat-map',                cache('30s'), (req, res, next) => ctrl().getSeatMap(req, res, next));

// ════════════════════════════════════════════════════════════════════════════════
// ORGANIZER ROUTES
// ════════════════════════════════════════════════════════════════════════════════
const orgAuth = [authenticate, authorize(ROLES.ORGANIZER, ROLES.ADMIN, ROLES.SUPER_ADMIN)];

router.post('/',                          ...orgAuth, (req, res, next) => ctrl().createEvent(req, res, next));
router.put('/:slug',                      ...orgAuth, (req, res, next) => ctrl().updateEvent(req, res, next));
router.delete('/:slug',                   ...orgAuth, (req, res, next) => ctrl().deleteEvent(req, res, next));
router.post('/:slug/publish',             ...orgAuth, (req, res, next) => ctrl().publishEvent(req, res, next));
router.post('/:slug/cancel',              ...orgAuth, (req, res, next) => ctrl().cancelEvent(req, res, next));
router.post('/:slug/ticket-types',        ...orgAuth, (req, res, next) => ctrl().createTicketType(req, res, next));
router.put('/:slug/ticket-types/:id',     ...orgAuth, (req, res, next) => ctrl().updateTicketType(req, res, next));
router.delete('/:slug/ticket-types/:id',  ...orgAuth, (req, res, next) => ctrl().deleteTicketType(req, res, next));
router.post('/:slug/seat-sections',       ...orgAuth, (req, res, next) => ctrl().createSeatSection(req, res, next));
router.put('/:slug/seat-sections/:id',    ...orgAuth, (req, res, next) => ctrl().updateSeatSection(req, res, next));

// ════════════════════════════════════════════════════════════════════════════════
// ADMIN ROUTES
// ════════════════════════════════════════════════════════════════════════════════
const adminAuth = [authenticate, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN)];

router.put('/:slug/approve', ...adminAuth, (req, res, next) => ctrl().approveEvent(req, res, next));
router.put('/:slug/reject',  ...adminAuth, (req, res, next) => ctrl().rejectEvent(req, res, next));

module.exports = router;
