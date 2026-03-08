"use strict";

const { createRateLimiter } = require("../../config/rateLimit.config");

// ── Preset configs per route group ────────────────────────────────────────────
const presets = {
  auth: {
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: "Too many auth requests, please try again later.",
  },
  default: {
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later.",
  },
};

/**
 * Usage in routes.js:
 *   router.use("/auth", rateLimiter("auth"), authRoutes);
 */
const rateLimiter = (type = "default") => {
  const config = presets[type] || presets.default;
  return createRateLimiter(config);
};

module.exports = { rateLimiter };
