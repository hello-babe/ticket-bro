// ============================================================
//  ERROR HANDLER UTILITY
//  src/common/errors/errorHandler.js
// ============================================================

const logger = require("../../infrastructure/logger/logger");
const { ERROR_CODES } = require("./errorCodes");
const ApiError = require("./ApiError");

class ErrorHandler {
  static handleError(error, req = null) {
    // Log error
    if (error.isOperational) {
      logger.warn("Operational error:", {
        message: error.message,
        statusCode: error.statusCode,
        errorCode: error.errorCode,
        stack: error.stack,
      });
    } else {
      logger.error("System error:", {
        message: error.message,
        stack: error.stack,
        ...(req && {
          path: req.path,
          method: req.method,
          ip: req.ip,
          userId: req.user?._id,
        }),
      });
    }

    // Send to monitoring service if needed
    if (process.env.NODE_ENV === "production") {
      this.reportError(error, req);
    }
  }

  static reportError(error, req) {
    // Implement error reporting to services like Sentry, New Relic, etc.
    if (process.env.SENTRY_DSN) {
      const Sentry = require("@sentry/node");
      Sentry.captureException(error, {
        user: req?.user,
        tags: {
          errorCode: error.errorCode,
          statusCode: error.statusCode,
        },
      });
    }
  }

  static isOperationalError(error) {
    return error.isOperational === true;
  }

  static getErrorMessage(error) {
    if (error instanceof ApiError) {
      return {
        status: "error",
        message: error.message,
        code: error.errorCode,
        ...(process.env.NODE_ENV === "development" && {
          stack: error.stack,
        }),
      };
    }

    // Handle Mongoose errors
    if (error.name === "ValidationError") {
      return {
        status: "error",
        message: "Validation error",
        code: ERROR_CODES.VALIDATION_ERROR,
        errors: Object.values(error.errors).map((e) => e.message),
      };
    }

    if (error.name === "CastError") {
      return {
        status: "error",
        message: "Invalid data format",
        code: ERROR_CODES.DB_CAST_ERROR,
      };
    }

    if (error.code === 11000) {
      return {
        status: "error",
        message: "Duplicate key error",
        code: ERROR_CODES.DB_DUPLICATE_KEY,
        field: Object.keys(error.keyPattern)[0],
      };
    }

    // Handle JWT errors
    if (error.name === "JsonWebTokenError") {
      return {
        status: "error",
        message: "Invalid token",
        code: ERROR_CODES.AUTH_TOKEN_INVALID,
      };
    }

    if (error.name === "TokenExpiredError") {
      return {
        status: "error",
        message: "Token expired",
        code: ERROR_CODES.AUTH_TOKEN_EXPIRED,
      };
    }

    // Default error
    return {
      status: "error",
      message: error.message || "Internal server error",
      code: error.errorCode || ERROR_CODES.SYSTEM_ERROR,
      ...(process.env.NODE_ENV === "development" && {
        stack: error.stack,
      }),
    };
  }
}

module.exports = ErrorHandler;
