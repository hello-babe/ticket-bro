// ============================================================
//  LOGGING MIDDLEWARE
//  src/common/middleware/logging.middleware.js
// ============================================================

const morgan = require("morgan");
const logger = require("../../infrastructure/logger/logger");
const { sanitizeLogData } = require("./sanitize.middleware");

// Custom token for request body
morgan.token("body", (req) => {
  if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
    return JSON.stringify(sanitizeLogData(req.body));
  }
  return "";
});

// Custom token for response body
morgan.token("res-body", (req, res) => {
  return res.locals.body
    ? JSON.stringify(sanitizeLogData(res.locals.body))
    : "";
});

// Custom token for user ID
morgan.token("userId", (req) => {
  return req.user ? req.user._id : "anonymous";
});

// Custom token for request duration in ms
morgan.token("duration", (req, res) => {
  if (!res._startTime || !process.hrtime) return "";
  const elapsed = process.hrtime(res._startTime);
  const ms = elapsed[0] * 1000 + elapsed[1] / 1000000;
  return ms.toFixed(3);
});

// Development format
const developmentFormat =
  ":method :url :status :duration ms - :res[content-length] bytes - userId::userId";

// Production format (JSON)
const productionFormat = JSON.stringify({
  timestamp: ":date[iso]",
  method: ":method",
  url: ":url",
  status: ":status",
  duration: ":duration",
  contentLength: ":res[content-length]",
  userId: ":userId",
  ip: ":remote-addr",
  userAgent: ":user-agent",
  referrer: ":referrer",
});

// Create Morgan middleware
const morganMiddleware = morgan(
  (tokens, req, res) => {
    if (process.env.NODE_ENV === "development") {
      return developmentFormat;
    }

    // Parse JSON format for production
    return JSON.parse(productionFormat);
  },
  {
    stream: {
      write: (message) => {
        if (process.env.NODE_ENV === "development") {
          logger.debug(message.trim());
        } else {
          logger.info("HTTP Request", JSON.parse(message));
        }
      },
    },
    skip: (req, res) => {
      // Skip health check endpoints
      return req.path === "/health" || req.path === "/metrics";
    },
  },
);

// Request logging middleware
const requestLogger = (req, res, next) => {
  res._startTime = process.hrtime();

  // Log request
  logger.debug(`${req.method} ${req.url}`, {
    query: sanitizeLogData(req.query),
    params: sanitizeLogData(req.params),
    body: sanitizeLogData(req.body),
    ip: req.ip,
    userAgent: req.get("user-agent"),
    userId: req.user?._id,
  });

  // Capture response body
  const originalSend = res.send;
  res.send = function (body) {
    res.locals.body = body;
    originalSend.call(this, body);
  };

  next();
};

// Response logging middleware
const responseLogger = (req, res, next) => {
  res.on("finish", () => {
    const duration = res._startTime
      ? (
          process.hrtime(res._startTime)[0] * 1000 +
          process.hrtime(res._startTime)[1] / 1000000
        ).toFixed(3)
      : "unknown";

    logger.http(`${req.method} ${req.url} ${res.statusCode} ${duration}ms`, {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: duration,
      userId: req.user?._id,
      ip: req.ip,
    });
  });

  next();
};

// Error logging middleware
const errorLogger = (err, req, res, next) => {
  logger.error("Request error:", {
    error: {
      message: err.message,
      stack: err.stack,
      code: err.errorCode,
    },
    request: {
      method: req.method,
      url: req.url,
      query: sanitizeLogData(req.query),
      params: sanitizeLogData(req.params),
      body: sanitizeLogData(req.body),
      ip: req.ip,
      userAgent: req.get("user-agent"),
      userId: req.user?._id,
    },
  });

  next(err);
};

// Combine logging middleware
const loggingMiddleware = (req, res, next) => {
  requestLogger(req, res, () => {
    responseLogger(req, res, () => {
      morganMiddleware(req, res, next);
    });
  });
};

module.exports = {
  loggingMiddleware,
  requestLogger,
  responseLogger,
  errorLogger,
};
