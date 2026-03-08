'use strict';

const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');

const authConfig = require('./auth.config');
const env = require('./env');

// ── KEY GENERATOR ─────────────────────────────────────────────
const keyGenerator = (req) => {
  const ip = ipKeyGenerator(req); // IPv6 safe

  if (env.isDevelopment()) {
    const ua = req.headers['user-agent'] || 'unknown';
    return `${ip}::${ua.slice(0, 50)}`;
  }

  return ip;
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

    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: options.skipSuccessfulRequests || false,

    keyGenerator,

    skip: () => env.isTest(),

    handler: (req, res, _next, opts) => {
      res.status(429).json(opts.message);
    },
  });
};

// ── DEV vs PROD limits ────────────────────────────────────────
const devMultiplier = env.isDevelopment() ? 10 : 1;

const globalLimiter = createRateLimiter({
  ...authConfig.rateLimiting.global,
  max: authConfig.rateLimiting.global.max * devMultiplier,
});

const loginLimiter = createRateLimiter({
  ...authConfig.rateLimiting.login,
  max: authConfig.rateLimiting.login.max * devMultiplier,
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