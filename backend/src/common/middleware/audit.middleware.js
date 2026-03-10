// ============================================================
//  AUDIT MIDDLEWARE
//  src/common/middleware/audit.middleware.js
// ============================================================

const AuditLog = require("../../modules/auditLogs/audit.model");
const logger = require("../../infrastructure/logger/logger");
const { sanitizeLogData } = require("./sanitize.middleware");

// Skip audit logging for certain paths
const SKIP_PATHS = ["/health", "/metrics", "/favicon.ico"];
const SKIP_METHODS = ["OPTIONS"];

// Determine action type based on HTTP method
const getActionType = (method) => {
  const actions = {
    GET: "READ",
    POST: "CREATE",
    PUT: "UPDATE",
    PATCH: "UPDATE",
    DELETE: "DELETE",
  };
  return actions[method] || "UNKNOWN";
};

// Extract resource from URL
const extractResource = (url) => {
  const parts = url.split("/").filter((p) => p && !p.match(/^[0-9a-f]{24}$/));
  return parts.length > 0 ? parts[parts.length - 1] : "unknown";
};

// Extract resource ID from URL
const extractResourceId = (url) => {
  const parts = url.split("/");
  for (const part of parts) {
    if (part && part.match(/^[0-9a-f]{24}$/)) {
      return part;
    }
  }
  return null;
};

// Get changes for update operations
const getChanges = (oldData, newData) => {
  const changes = {};

  const findChanges = (obj1, obj2, path = "") => {
    Object.keys(obj2).forEach((key) => {
      const currentPath = path ? `${path}.${key}` : key;

      if (
        typeof obj2[key] === "object" &&
        obj2[key] !== null &&
        !Array.isArray(obj2[key])
      ) {
        findChanges(obj1?.[key] || {}, obj2[key], currentPath);
      } else if (JSON.stringify(obj1?.[key]) !== JSON.stringify(obj2[key])) {
        changes[currentPath] = {
          old: obj1?.[key],
          new: obj2[key],
        };
      }
    });
  };

  findChanges(oldData, newData);
  return changes;
};

// Main audit middleware
const auditMiddleware = async (req, res, next) => {
  // Skip audit for certain paths and methods
  if (SKIP_PATHS.includes(req.path) || SKIP_METHODS.includes(req.method)) {
    return next();
  }

  // Store original data for update operations
  let originalData = null;
  if (req.method === "PUT" || req.method === "PATCH") {
    const resourceId = extractResourceId(req.url);
    if (resourceId && req.model) {
      try {
        originalData = await req.model.findById(resourceId).lean();
      } catch (error) {
        logger.warn("Could not fetch original data for audit:", error.message);
      }
    }
  }

  // Capture response
  const originalSend = res.send;
  let responseBody;

  res.send = function (body) {
    responseBody = body;
    res.locals.body = body;
    originalSend.call(this, body);
  };

  // Wait for response to finish
  res.on("finish", async () => {
    try {
      // Don't audit errors (handled by error logger)
      if (res.statusCode >= 400) {
        return;
      }

      const auditLog = new AuditLog({
        timestamp: new Date(),
        user: req.user?._id,
        ip: req.ip,
        userAgent: req.get("user-agent"),
        action: getActionType(req.method),
        resource: extractResource(req.url),
        resourceId: extractResourceId(req.url),
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        request: {
          query: sanitizeLogData(req.query),
          params: sanitizeLogData(req.params),
          body: sanitizeLogData(req.body),
          headers: {
            "user-agent": req.get("user-agent"),
            referer: req.get("referer"),
            "content-type": req.get("content-type"),
          },
        },
        response: {
          body: sanitizeLogData(responseBody),
          headers: res.getHeaders(),
        },
        changes: originalData ? getChanges(originalData, req.body) : undefined,
        sessionId: req.session?.id,
        location: {
          country: req.get("cf-ipcountry") || req.get("x-country"),
          city: req.get("x-city"),
          coordinates:
            req.get("x-longitude") && req.get("x-latitude")
              ? {
                  longitude: parseFloat(req.get("x-longitude")),
                  latitude: parseFloat(req.get("x-latitude")),
                }
              : undefined,
        },
      });

      await auditLog.save();

      // Also log to file
      logger.info("Audit log created", {
        userId: req.user?._id,
        action: auditLog.action,
        resource: auditLog.resource,
        resourceId: auditLog.resourceId,
      });
    } catch (error) {
      logger.error("Failed to create audit log:", error);
    }
  });

  next();
};

// Batch audit middleware for bulk operations
const batchAuditMiddleware = (action, resource, items) => {
  return async (req, res, next) => {
    const auditPromises = items.map((item) => {
      const auditLog = new AuditLog({
        timestamp: new Date(),
        user: req.user?._id,
        ip: req.ip,
        userAgent: req.get("user-agent"),
        action,
        resource,
        resourceId: item._id,
        method: req.method,
        url: req.url,
        statusCode: 200,
        request: {
          body: sanitizeLogData(item),
        },
      });

      return auditLog.save();
    });

    try {
      await Promise.all(auditPromises);
      logger.info(
        `Batch audit logs created: ${action} ${items.length} ${resource}`,
      );
    } catch (error) {
      logger.error("Failed to create batch audit logs:", error);
    }

    next();
  };
};

module.exports = {
  auditMiddleware,
  batchAuditMiddleware,
};
