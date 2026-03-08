"use strict";

require("express-async-errors");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");

const env = require("./config/env");
const { globalLimiter } = require("./config/rateLimit.config");
const routes = require("./routes"); // ← your main routes.js
const {
  errorHandler,
  notFound,
} = require("./common/middleware/errorHandler.middleware");
const { sanitizeBody } = require("./common/middleware/validation.middleware");
const logger = require("./infrastructure/logger/logger");

// Initialize passport strategies
require("./modules/auth/strategies/passport");

const app = express();

// ── Security Middleware ───────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: env.isProduction(),
  }),
);

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [env.FRONTEND_URL, env.BACKEND_URL];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

// ── Rate Limiting ─────────────────────────────────────────────────────────────
app.use(globalLimiter);

// ── Webhook Raw Body (MUST come before express.json) ─────────────────────────
// Stripe/Razorpay/PayPal require the raw body for signature verification
const API_PREFIX = `${env.API_PREFIX}/${env.API_VERSION}`;
app.use(
  `${API_PREFIX}/webhooks`,
  express.raw({ type: "application/json" }),
);

// ── Body Parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser(env.COOKIE_SECRET));

// ── Sanitization ──────────────────────────────────────────────────────────────
app.use(mongoSanitize()); // Prevent MongoDB injection
app.use(sanitizeBody);

// ── Compression ───────────────────────────────────────────────────────────────
app.use(compression());

// ── HTTP Logging ──────────────────────────────────────────────────────────────
if (!env.isTest()) {
  app.use(morgan("combined", { stream: logger.stream }));
}

// ── Trust Proxy (for IP behind reverse proxy) ─────────────────────────────────
if (env.isProduction()) {
  app.set("trust proxy", 1);
}

// ── Health Check ──────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    version: process.env.npm_package_version || "1.0.0",
    uptime: process.uptime(),
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────
// All routes defined in routes.js are now mounted under /api/v1
app.use(API_PREFIX, routes);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use(notFound);

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;