"use strict";

// ── Common auth middleware ─────────────────────────────────────────────────────
// This is the canonical file used by non-auth modules (events, bookings, etc.)
// It re-exports from the module-level file with the aliases those modules expect.
//
// FIX: Previously this file had its own copy of the authenticate logic that was
// missing the `wasPasswordChangedAfter` check. Now it delegates entirely to the
// module file so there's only ONE implementation to maintain.

const moduleAuth = require('../../modules/auth/auth.middleware');

// Named exports used by other modules
const authenticate = moduleAuth.protect;           // alias: protect → authenticate
const authorize = moduleAuth.restrictTo;           // alias: restrictTo → authorize
const optionalAuth = moduleAuth.optionalAuth;
const requireMinRole = moduleAuth.requireMinRole;
const requirePermission = moduleAuth.requirePermission;
const requireEmailVerified = moduleAuth.requireEmailVerified;
const extractRefreshToken = moduleAuth.extractRefreshToken;

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
  requireMinRole,
  requirePermission,
  requireEmailVerified,
  extractRefreshToken,
};
