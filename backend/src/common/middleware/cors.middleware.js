// ============================================================
//  CORS MIDDLEWARE
//  src/common/middleware/cors.middleware.js
// ============================================================

const cors = require("cors");
const config = require("../../config/env");
const logger = require("../../infrastructure/logger/logger");

// Configure CORS options
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) {
      return callback(null, true);
    }

    // Check if origin is allowed
    const allowedOrigins = config.CORS.ORIGIN.split(",").map((o) => o.trim());

    if (config.NODE_ENV === "development") {
      // In development, allow all origins
      return callback(null, true);
    }

    if (allowedOrigins.includes("*")) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: config.CORS.CREDENTIALS,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "X-Forwarded-For",
    "X-Real-IP",
    "Accept",
    "Origin",
  ],
  exposedHeaders: [
    "Content-Range",
    "X-Content-Range",
    "X-Total-Count",
    "X-RateLimit-Limit",
    "X-RateLimit-Remaining",
    "X-RateLimit-Reset",
  ],
  maxAge: 86400, // 24 hours
};

// Create CORS middleware
const corsMiddleware = cors(corsOptions);

// Handle preflight requests
const handlePreflight = (req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With",
    );
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Max-Age", "86400");
    return res.status(200).end();
  }
  next();
};

module.exports = {
  corsMiddleware,
  handlePreflight,
};
