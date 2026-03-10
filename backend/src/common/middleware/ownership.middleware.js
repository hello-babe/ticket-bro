// ============================================================
//  OWNERSHIP MIDDLEWARE
//  src/common/middleware/ownership.middleware.js
// ============================================================

const { ApiError } = require("../errors/ApiError");
const { ROLES } = require("../constants/roles");
const logger = require("../../infrastructure/logger/logger");

/**
 * Check if user owns a resource or has admin privileges
 * @param {Function} getOwnerId - Function to get owner ID from request
 * @param {Object} options - Options
 */
const checkOwnership = (getOwnerId, options = {}) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        throw ApiError.unauthorized("User not authenticated");
      }

      // Get owner ID
      const ownerId = await getOwnerId(req);

      if (!ownerId) {
        throw ApiError.notFound("Resource owner not found");
      }

      // Check if user is owner
      const isOwner = ownerId.toString() === req.user._id.toString();

      // Check if user has admin privileges
      const isAdmin = [ROLES.ADMIN, ROLES.SUPERADMIN].includes(req.user.role);

      // Allow if owner or admin
      if (isOwner || isAdmin) {
        req.resourceOwner = ownerId;
        return next();
      }

      // Check if user is organizer for event resources
      if (options.checkOrganizer && req.user.role === ROLES.ORGANIZER) {
        // Check if user is the organizer of this event
        const Event = require("../../modules/events/event.model");
        const event = await Event.findOne({
          _id: req.params.eventId || req.params.id,
          "organizer.id": req.user._id,
        });

        if (event) {
          req.resourceOwner = ownerId;
          return next();
        }
      }

      logger.warn(
        `Ownership check failed: User ${req.user._id} attempted to access resource owned by ${ownerId}`,
      );
      throw ApiError.forbidden(
        "You do not have permission to access this resource",
      );
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Common ownership check for user resources
 */
const checkUserOwnership = (paramName = "userId") => {
  return checkOwnership(async (req) => {
    return req.params[paramName] || req.user._id;
  });
};

/**
 * Common ownership check for event resources
 */
const checkEventOwnership = (paramName = "eventId") => {
  return checkOwnership(
    async (req) => {
      const Event = require("../../modules/events/event.model");
      const event = await Event.findById(req.params[paramName]).select(
        "organizer",
      );

      if (!event) {
        throw ApiError.notFound("Event not found");
      }

      return event.organizer.id;
    },
    { checkOrganizer: true },
  );
};

/**
 * Common ownership check for booking resources
 */
const checkBookingOwnership = (paramName = "bookingId") => {
  return checkOwnership(async (req) => {
    const Booking = require("../../modules/bookings/booking.model");
    const booking = await Booking.findById(req.params[paramName]).select(
      "user",
    );

    if (!booking) {
      throw ApiError.notFound("Booking not found");
    }

    return booking.user.id;
  });
};

/**
 * Common ownership check for organizer resources
 */
const checkOrganizerOwnership = (paramName = "organizerId") => {
  return checkOwnership(
    async (req) => {
      return req.params[paramName];
    },
    { checkOrganizer: true },
  );
};

module.exports = {
  checkOwnership,
  checkUserOwnership,
  checkEventOwnership,
  checkBookingOwnership,
  checkOrganizerOwnership,
};
