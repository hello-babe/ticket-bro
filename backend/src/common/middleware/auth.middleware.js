"use strict";

const {
  verifyAccessToken,
  extractBearerToken,
} = require("../utils/tokenGenerator");
const authRepository = require("../../modules/auth/auth.repository");
const { UnauthorizedError, ForbiddenError } = require("../errors/AppError");
const { ROLES, hasMinimumRole, hasPermission } = require("../constants/roles");
const asyncHandler = require("../utils/asyncHandler");
const logger = require("../../infrastructure/logger/logger");

/**
 * Protect routes — require valid JWT access token
 */
const authenticate = asyncHandler(async (req, res, next) => {
  // 1. Extract token from header or cookie
  let token = extractBearerToken(req.headers.authorization);
  if (!token && req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new UnauthorizedError("Access token is required. Please login.");
  }

  // 2. Verify token
  const decoded = verifyAccessToken(token);

  // 3. Find user
  const user = await authRepository.findUserById(decoded.userId);
  if (!user) {
    throw new UnauthorizedError(
      "The user belonging to this token no longer exists.",
    );
  }

  // 4. Check if user is active
  if (!user.isActive) {
    throw new ForbiddenError(
      "Your account has been deactivated. Please contact support.",
    );
  }

  // 5. Check if password was changed after token issued
  if (user.wasPasswordChangedAfter(decoded.iat)) {
    throw new UnauthorizedError(
      "Password was recently changed. Please login again.",
    );
  }

  // 6. Attach user to request
  req.user = user;
  req.tokenPayload = decoded;

  next();
});

/**
 * Optionally authenticate — attach user if token present, don't fail if not
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = extractBearerToken(req.headers.authorization);
  if (!token) return next();

  try {
    const decoded = verifyAccessToken(token);
    const user = await authRepository.findUserById(decoded.userId);
    if (user && user.isActive) {
      req.user = user;
      req.tokenPayload = decoded;
    }
  } catch {
    // Silently fail for optional auth
  }
  next();
});

/**
 * Restrict to specific roles
 * Usage: authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN)
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required.");
    }
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError(
        `Access denied. Required roles: ${roles.join(", ")}`,
      );
    }
    next();
  };
};

/**
 * Require minimum role level
 * Usage: requireMinRole(ROLES.MODERATOR)
 */
const requireMinRole = (minimumRole) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required.");
    }
    if (!hasMinimumRole(req.user.role, minimumRole)) {
      throw new ForbiddenError(
        `Access denied. Minimum required role: ${minimumRole}`,
      );
    }
    next();
  };
};

module.exports = {
  authenticate,
  optionalAuth,
  authorize,
  requireMinRole,
};
