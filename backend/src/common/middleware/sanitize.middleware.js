// ============================================================
//  SANITIZE MIDDLEWARE
//  src/common/middleware/sanitize.middleware.js
// ============================================================
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const helmet = require("helmet");
const { ApiError } = require("../errors/ApiError");

// Configure XSS protection
const xssMiddleware = xss();

// Configure MongoDB query sanitization
const mongoSanitizeMiddleware = mongoSanitize({
  replaceWith: "_",
  onSanitize: ({ req, key }) => {
    console.warn(`Attempted injection detected in ${key}`);
  },
});

// SQL injection protection (basic)
const sqlInjectionPattern =
  /(\b(select|insert|update|delete|drop|union|exec|execute|create|alter|rename|truncate|destroy)\b)|(';)|(--)/i;

const sqlInjectionMiddleware = (req, res, next) => {
  const checkValue = (value) => {
    if (typeof value === "string" && sqlInjectionPattern.test(value)) {
      throw ApiError.badRequest("Potential SQL injection detected");
    }
    return value;
  };

  try {
    // Check query parameters
    if (req.query) {
      Object.keys(req.query).forEach((key) => {
        req.query[key] = checkValue(req.query[key]);
      });
    }

    // Check body
    if (req.body) {
      const checkObject = (obj) => {
        Object.keys(obj).forEach((key) => {
          if (typeof obj[key] === "object" && obj[key] !== null) {
            checkObject(obj[key]);
          } else {
            obj[key] = checkValue(obj[key]);
          }
        });
      };
      checkObject(req.body);
    }

    // Check params
    if (req.params) {
      Object.keys(req.params).forEach((key) => {
        req.params[key] = checkValue(req.params[key]);
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Remove sensitive data from logs
const sanitizeLogData = (data) => {
  const sensitiveFields = [
    "password",
    "token",
    "authorization",
    "cookie",
    "secret",
    "key",
  ];
  const sanitized = { ...data };

  const sanitizeObject = (obj) => {
    Object.keys(obj).forEach((key) => {
      if (sensitiveFields.some((field) => key.toLowerCase().includes(field))) {
        obj[key] = "[REDACTED]";
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    });
  };

  sanitizeObject(sanitized);
  return sanitized;
};

// Combine all sanitization middleware
const sanitizeMiddleware = (req, res, next) => {
  // Apply sanitization in sequence
  mongoSanitizeMiddleware(req, res, (err) => {
    if (err) return next(err);

    xssMiddleware(req, res, (err) => {
      if (err) return next(err);

      sqlInjectionMiddleware(req, res, next);
    });
  });
};

module.exports = {
  sanitizeMiddleware,
  sanitizeLogData,
};