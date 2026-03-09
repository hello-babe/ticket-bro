'use strict';

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const env = require('../../config/env');

/**
 * Hash a plain text password
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(env.BCRYPT_SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

/**
 * Compare plain text password with hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>}
 */
const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

/**
 * Generate a cryptographically secure random token
 * @param {number} bytes - Number of bytes (default 32)
 * @returns {string} Hex-encoded token
 */
const generateSecureToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString('hex');
};

/**
 * Hash a token using SHA-256 (for storing reset/verify tokens)
 * @param {string} token - Plain token
 * @returns {string} Hashed token
 */
const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Generate a cryptographically secure 6-digit OTP.
 * FIX: was Math.floor(100000 + Math.random() * 900000) — Math.random() is NOT
 *      cryptographically secure and can be predicted by an attacker.
 *      crypto.randomInt(min, max) uses OS CSPRNG, making the OTP unpredictable.
 * @returns {string} 6-digit zero-padded OTP
 */
const generateOTP = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

/**
 * Calculate OTP expiry time
 * @param {number} minutes - Minutes until expiry
 * @returns {Date} Expiry date
 */
const getOTPExpiry = (minutes = 10) => {
  return new Date(Date.now() + minutes * 60 * 1000);
};

/**
 * Generate N recovery codes in XXXX-XXXX format
 * @param {number} count
 * @returns {string[]}
 */
const generateRecoveryCodes = (count = 8) => {
  return Array.from({ length: count }, () =>
    generateSecureToken(4)
      .toUpperCase()
      .match(/.{1,4}/g)
      .join('-'),
  );
};

module.exports = {
  hashPassword,
  comparePassword,
  generateSecureToken,
  hashToken,
  generateOTP,
  getOTPExpiry,
  generateRecoveryCodes,
};
