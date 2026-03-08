'use strict';

// organizer.routes.js
//
// Mounted TWICE in routes.js:
//   1. router.use('/organizers', organizerRoutes)          → public profile reads
//   2. router.use('/organizer', authenticate, authorize(ROLES.ORGANIZER), organizerRoutes)
//      → organizer-private routes
//
// Each route checks req.user to distinguish public vs private context.

const express = require('express');
const router = express.Router();
const { optionalAuth, authenticate, authorize } = require('../../common/middleware/auth.middleware');
const { cache } = require('../../common/middleware/cache.middleware');
const { ROLES } = require('../../common/constants/roles');

let _ctrl;
const ctrl = () => { if (!_ctrl) _ctrl = require('./organizer.controller'); return _ctrl; };

// ════════════════════════════════════════════════════════════════════════════════
// PUBLIC PROFILE ROUTES  (accessible at /api/v1/organizers/*)
// ════════════════════════════════════════════════════════════════════════════════

// GET /organizers/:slug  — public organizer profile
router.get('/:slug',
  cache('5m'),
  (req, res, next) => ctrl().getPublicProfile(req, res, next));

// GET /organizers/:slug/events  — public list of organizer events
router.get('/:slug/events',
  (req, res, next) => ctrl().getPublicEvents(req, res, next));

// ════════════════════════════════════════════════════════════════════════════════
// ORGANIZER-PRIVATE ROUTES  (accessible at /api/v1/organizer/*)
// authenticate + authorize(ROLES.ORGANIZER) already applied in routes.js
// ════════════════════════════════════════════════════════════════════════════════

// GET    /organizer/profile
router.get('/profile',
  authenticate,
  authorize(ROLES.ORGANIZER, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  (req, res, next) => ctrl().getOwnProfile(req, res, next));

// PUT    /organizer/profile
router.put('/profile',
  authenticate,
  authorize(ROLES.ORGANIZER, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  (req, res, next) => ctrl().updateProfile(req, res, next));

// POST   /organizer/verification
router.post('/verification',
  authenticate,
  authorize(ROLES.ORGANIZER, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  (req, res, next) => ctrl().submitVerification(req, res, next));

// GET    /organizer/verification
router.get('/verification',
  authenticate,
  authorize(ROLES.ORGANIZER, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  (req, res, next) => ctrl().getVerificationStatus(req, res, next));

// GET    /organizer/dashboard
router.get('/dashboard',
  authenticate,
  authorize(ROLES.ORGANIZER, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  (req, res, next) => ctrl().getDashboard(req, res, next));

// GET    /organizer/events
router.get('/events',
  authenticate,
  authorize(ROLES.ORGANIZER, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  (req, res, next) => ctrl().getMyEvents(req, res, next));

// GET    /organizer/bookings
router.get('/bookings',
  authenticate,
  authorize(ROLES.ORGANIZER, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  (req, res, next) => ctrl().getMyBookings(req, res, next));

// GET    /organizer/revenue
router.get('/revenue',
  authenticate,
  authorize(ROLES.ORGANIZER, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  (req, res, next) => ctrl().getRevenue(req, res, next));

// GET    /organizer/payouts
router.get('/payouts',
  authenticate,
  authorize(ROLES.ORGANIZER, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  (req, res, next) => ctrl().getPayouts(req, res, next));

module.exports = router;
