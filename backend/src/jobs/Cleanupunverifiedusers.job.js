'use strict';

// backend/src/jobs/cleanupUnverifiedUsers.job.js
//
// Runs every hour. Deletes users who:
//   - registered more than 24 hours ago
//   - never verified their email
//   - signed up with local provider (not OAuth — those are pre-verified)

const cron    = require('node-cron');
const User    = require('../modules/users/user.model');
const logger  = require('../infrastructure/logger/logger');

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

const deleteUnverifiedUsers = async () => {
  try {
    const cutoff = new Date(Date.now() - TWENTY_FOUR_HOURS_MS);

    const result = await User.deleteMany({
      isEmailVerified: false,
      oauthProvider:   'local',   // never delete OAuth users — they're pre-verified
      createdAt:       { $lt: cutoff },
      deletedAt:       null,
    });

    if (result.deletedCount > 0) {
      logger.info(
        `[Cleanup] Deleted ${result.deletedCount} unverified user(s) older than 24h`,
      );
    }
  } catch (err) {
    logger.error(`[Cleanup] Failed to delete unverified users: ${err.message}`);
  }
};

/**
 * Start the cleanup cron job.
 * Call this once in your app entry point (app.js / server.js).
 *
 * Schedule: every hour at minute 0  →  '0 * * * *'
 */
const startCleanupJob = () => {
  cron.schedule('0 * * * *', deleteUnverifiedUsers, {
    scheduled: true,
    timezone:  'UTC',
  });

  logger.info('[Cleanup] Unverified-user cleanup job scheduled (every hour)');

  // Also run immediately on startup to catch any leftovers
  deleteUnverifiedUsers();
};

module.exports = { startCleanupJob, deleteUnverifiedUsers };