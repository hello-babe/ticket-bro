'use strict';

const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.config');
const { UnauthorizedError } = require('../errors/AppError');

// ── Token type constants ───────────────────────────────────────────────────────
// FIX: Embed a 'type' claim in every token payload so access tokens cannot be
// replayed as refresh tokens (substitution / confused-deputy attack).
const TOKEN_TYPES = {
  ACCESS: 'access',
  REFRESH: 'refresh',
  EMAIL_VERIFICATION: 'email_verification',
  PASSWORD_RESET: 'password_reset',
};

/**
 * Generate JWT Access Token
 */
const generateAccessToken = (payload) => {
  const { secret, expiresIn, algorithm } = authConfig.jwt.accessToken;
  return jwt.sign({ ...payload, type: TOKEN_TYPES.ACCESS }, secret, { expiresIn, algorithm });
};

/**
 * Generate JWT Refresh Token
 */
const generateRefreshToken = (payload) => {
  const { secret, expiresIn, algorithm } = authConfig.jwt.refreshToken;
  return jwt.sign({ ...payload, type: TOKEN_TYPES.REFRESH }, secret, { expiresIn, algorithm });
};

/**
 * Generate Email Verification Token
 */
const generateEmailVerificationToken = (payload) => {
  const { secret, expiresIn } = authConfig.jwt.emailVerification;
  return jwt.sign({ ...payload, type: TOKEN_TYPES.EMAIL_VERIFICATION }, secret, { expiresIn });
};

/**
 * Generate Password Reset Token
 */
const generatePasswordResetToken = (payload) => {
  const { secret, expiresIn } = authConfig.jwt.passwordReset;
  return jwt.sign({ ...payload, type: TOKEN_TYPES.PASSWORD_RESET }, secret, { expiresIn });
};

/**
 * Verify Access Token
 * FIX: Rejects tokens whose 'type' claim is not 'access' (prevents refresh token
 *      from being accepted here).
 */
const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, authConfig.jwt.accessToken.secret);
    if (decoded.type && decoded.type !== TOKEN_TYPES.ACCESS) {
      throw new UnauthorizedError('Invalid token type.');
    }
    return decoded;
  } catch (error) {
    if (error instanceof UnauthorizedError) throw error;
    if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Access token has expired. Please refresh your token.');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new UnauthorizedError('Invalid access token.');
    }
    throw new UnauthorizedError('Token verification failed.');
  }
};

/**
 * Verify Refresh Token
 * FIX: Rejects tokens whose 'type' claim is not 'refresh'.
 */
const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, authConfig.jwt.refreshToken.secret);
    if (decoded.type && decoded.type !== TOKEN_TYPES.REFRESH) {
      throw new UnauthorizedError('Invalid token type.');
    }
    return decoded;
  } catch (error) {
    if (error instanceof UnauthorizedError) throw error;
    if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Refresh token has expired. Please login again.');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new UnauthorizedError('Invalid refresh token.');
    }
    throw new UnauthorizedError('Token verification failed.');
  }
};

/**
 * Verify Email Verification Token
 */
const verifyEmailVerificationToken = (token) => {
  try {
    const decoded = jwt.verify(token, authConfig.jwt.emailVerification.secret);
    if (decoded.type && decoded.type !== TOKEN_TYPES.EMAIL_VERIFICATION) {
      throw new UnauthorizedError('Invalid token type.');
    }
    return decoded;
  } catch (error) {
    if (error instanceof UnauthorizedError) throw error;
    if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Email verification link has expired. Please request a new one.');
    }
    throw new UnauthorizedError('Invalid email verification token.');
  }
};

/**
 * Verify Password Reset Token
 */
const verifyPasswordResetToken = (token) => {
  try {
    const decoded = jwt.verify(token, authConfig.jwt.passwordReset.secret);
    if (decoded.type && decoded.type !== TOKEN_TYPES.PASSWORD_RESET) {
      throw new UnauthorizedError('Invalid token type.');
    }
    return decoded;
  } catch (error) {
    if (error instanceof UnauthorizedError) throw error;
    if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Password reset link has expired. Please request a new one.');
    }
    throw new UnauthorizedError('Invalid password reset token.');
  }
};

/**
 * Decode a token without verification (for reading expired tokens)
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

/**
 * Generate both access and refresh tokens
 */
const generateTokenPair = (payload) => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

/**
 * Extract token from Authorization header
 */
const extractBearerToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
};

module.exports = {
  TOKEN_TYPES,
  generateAccessToken,
  generateRefreshToken,
  generateEmailVerificationToken,
  generatePasswordResetToken,
  verifyAccessToken,
  verifyRefreshToken,
  verifyEmailVerificationToken,
  verifyPasswordResetToken,
  decodeToken,
  generateTokenPair,
  extractBearerToken,
};
