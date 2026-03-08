'use strict';

const rateLimit = require('express-rate-limit');
const authConfig = require('./auth.config');
const env = require('./env');

// ── KEY GENERATOR ─────────────────────────────────────────────────────────────
// In development all requests come from ::1/127.0.0.1 so every request shares
// the same bucket → 5 login attempts = 429 for EVERYONE.
//
// Fix A: In development, key = ip + truncated user-agent (each browser session
//        gets its own bucket so testing doesn't 429 you on the second attempt).
// Fix B: devMultiplier raises the ceiling 10× in development.
// Fix C: skipSuccessfulRequests:true on loginLimiter means successful logins
//        don't consume a slot — only failed attempts count against the limit.
const keyGenerator = (req) => {
  if (env.isDevelopment()) {
    const ua = req.headers['user-agent'] || 'unknown';
    return `${req.ip}::${ua.slice(0, 50)}`;
  }
  return req.ip;
};

const createRateLimiter = (options) => {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    message: {
      success: false,
      message: options.message || 'Too many requests, please try again later.',
      retryAfter: Math.ceil(options.windowMs / 1000 / 60) + ' minutes',
    },
    standardHeaders: true,  // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,   // Disable the `X-RateLimit-*` headers
    skipSuccessfulRequests: options.skipSuccessfulRequests || false,
    keyGenerator,
    skip: () => env.isTest(), // Skip entirely in test environment
    handler: (req, res, _next, opts) => {
      res.status(429).json(opts.message);
    },
  });
};

// ── DEV vs PROD limits ────────────────────────────────────────────────────────
// In development: limits are 10× higher so testing doesn't constantly 429.
// In production: strict limits apply as configured in auth.config.js.
const devMultiplier = env.isDevelopment() ? 10 : 1;

const globalLimiter = createRateLimiter({
  ...authConfig.rateLimiting.global,
  max: authConfig.rateLimiting.global.max * devMultiplier,
});

// loginLimiter: only failed attempts count (skipSuccessfulRequests: true)
const loginLimiter = createRateLimiter({
  ...authConfig.rateLimiting.login,
  max: authConfig.rateLimiting.login.max * devMultiplier, // dev: 50 | prod: 5
  skipSuccessfulRequests: true,
});

const forgotPasswordLimiter = createRateLimiter({
  ...authConfig.rateLimiting.forgotPassword,
  max: authConfig.rateLimiting.forgotPassword.max * devMultiplier,
});

const resendVerificationLimiter = createRateLimiter({
  ...authConfig.rateLimiting.resendVerification,
  max: authConfig.rateLimiting.resendVerification.max * devMultiplier,
});

module.exports = {
  globalLimiter,
  loginLimiter,
  forgotPasswordLimiter,
  resendVerificationLimiter,
  createRateLimiter,
};
