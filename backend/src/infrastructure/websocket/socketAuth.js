'use strict';

const { verifyAccessToken } = require('../../common/utils/tokenGenerator');
const authRepository = require('../../modules/auth/auth.repository');
const logger = require('../logger/logger');

/**
 * Socket.IO authentication middleware.
 *
 * Clients must send their access token in the socket handshake:
 *   const socket = io(SERVER_URL, {
 *     auth: { token: accessToken },
 *   });
 *
 * FIX: uses access token from handshake.auth (NOT the httpOnly cookie).
 * The httpOnly cookie is browser-only and cannot be read by a WebSocket client.
 * The access token is short-lived (15 min) so exposure risk is low.
 */
const socketAuth = async (socket, next) => {
  try {
    // Support token in auth object or query string (for legacy clients)
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.query?.token;

    if (!token) {
      return next(new Error('Authentication token required.'));
    }

    const decoded = verifyAccessToken(token);

    const user = await authRepository.findUserById(decoded.userId);
    if (!user) {
      return next(new Error('User not found.'));
    }

    if (!user.isActive) {
      return next(new Error('Account is deactivated.'));
    }

    // Attach user to socket for use in event handlers
    socket.user = user;
    socket.userId = user._id.toString();

    logger.debug(`Socket authenticated: ${user.email} [${socket.id}]`);
    next();
  } catch (error) {
    logger.warn(`Socket auth failed: ${error.message}`);
    next(new Error('Invalid or expired token.'));
  }
};

/**
 * Optional socket auth — attaches user if token valid, proceeds either way.
 * Useful for public rooms where authenticated users get extra features.
 */
const optionalSocketAuth = async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.query?.token;

    if (!token) return next();

    const decoded = verifyAccessToken(token);
    const user = await authRepository.findUserById(decoded.userId);

    if (user && user.isActive) {
      socket.user = user;
      socket.userId = user._id.toString();
    }
  } catch {
    // Silently proceed — optional auth
  }

  next();
};

module.exports = { socketAuth, optionalSocketAuth };
