// ============================================================
//  PERMISSIONS CONSTANTS
//  src/common/constants/permissions.js
// ============================================================

const PERMISSIONS = {
  // User permissions
  USER_CREATE: "user:create",
  USER_READ: "user:read",
  USER_UPDATE: "user:update",
  USER_DELETE: "user:delete",
  USER_LIST: "user:list",
  USER_BLOCK: "user:block",
  USER_VERIFY: "user:verify",

  // Profile permissions
  PROFILE_READ: "profile:read",
  PROFILE_UPDATE: "profile:update",
  PROFILE_DELETE: "profile:delete",

  // Event permissions
  EVENT_CREATE: "event:create",
  EVENT_READ: "event:read",
  EVENT_UPDATE: "event:update",
  EVENT_DELETE: "event:delete",
  EVENT_LIST: "event:list",
  EVENT_PUBLISH: "event:publish",
  EVENT_CANCEL: "event:cancel",
  EVENT_FEATURE: "event:feature",

  // Booking permissions
  BOOKING_CREATE: "booking:create",
  BOOKING_READ: "booking:read",
  BOOKING_UPDATE: "booking:update",
  BOOKING_CANCEL: "booking:cancel",
  BOOKING_LIST: "booking:list",
  BOOKING_APPROVE: "booking:approve",
  BOOKING_REFUND: "booking:refund",

  // Ticket permissions
  TICKET_GENERATE: "ticket:generate",
  TICKET_VALIDATE: "ticket:validate",
  TICKET_TRANSFER: "ticket:transfer",
  TICKET_CANCEL: "ticket:cancel",
  TICKET_READ: "ticket:read",

  // Payment permissions
  PAYMENT_PROCESS: "payment:process",
  PAYMENT_READ: "payment:read",
  PAYMENT_REFUND: "payment:refund",
  PAYMENT_LIST: "payment:list",

  // Payout permissions
  PAYOUT_REQUEST: "payout:request",
  PAYOUT_APPROVE: "payout:approve",
  PAYOUT_PROCESS: "payout:process",
  PAYOUT_READ: "payout:read",
  PAYOUT_LIST: "payout:list",

  // Organizer permissions
  ORGANIZER_APPLY: "organizer:apply",
  ORGANIZER_READ: "organizer:read",
  ORGANIZER_UPDATE: "organizer:update",
  ORGANIZER_APPROVE: "organizer:approve",
  ORGANIZER_REJECT: "organizer:reject",
  ORGANIZER_SUSPEND: "organizer:suspend",

  // Category permissions
  CATEGORY_CREATE: "category:create",
  CATEGORY_READ: "category:read",
  CATEGORY_UPDATE: "category:update",
  CATEGORY_DELETE: "category:delete",
  CATEGORY_LIST: "category:list",

  // Review permissions
  REVIEW_CREATE: "review:create",
  REVIEW_READ: "review:read",
  REVIEW_UPDATE: "review:update",
  REVIEW_DELETE: "review:delete",
  REVIEW_MODERATE: "review:moderate",
  REVIEW_REPLY: "review:reply",

  // Notification permissions
  NOTIFICATION_READ: "notification:read",
  NOTIFICATION_UPDATE: "notification:update",
  NOTIFICATION_DELETE: "notification:delete",
  NOTIFICATION_SEND: "notification:send",

  // Analytics permissions
  ANALYTICS_READ: "analytics:read",
  ANALYTICS_EXPORT: "analytics:export",
  ANALYTICS_VIEW_OWN: "analytics:view_own",
  ANALYTICS_VIEW_ALL: "analytics:view_all",

  // Report permissions
  REPORT_CREATE: "report:create",
  REPORT_READ: "report:read",
  REPORT_UPDATE: "report:update",
  REPORT_RESOLVE: "report:resolve",
  REPORT_DELETE: "report:delete",

  // Admin permissions
  ADMIN_CREATE: "admin:create",
  ADMIN_READ: "admin:read",
  ADMIN_UPDATE: "admin:update",
  ADMIN_DELETE: "admin:delete",
  ADMIN_LIST: "admin:list",

  // System permissions
  SYSTEM_SETTINGS: "system:settings",
  SYSTEM_LOGS: "system:logs",
  SYSTEM_BACKUP: "system:backup",
  SYSTEM_RESTORE: "system:restore",
  SYSTEM_MONITOR: "system:monitor",

  // Role permissions
  ROLE_ASSIGN: "role:assign",
  ROLE_REVOKE: "role:revoke",
  ROLE_LIST: "role:list",

  // Audit permissions
  AUDIT_READ: "audit:read",
  AUDIT_EXPORT: "audit:export",
};

// Role to permissions mapping
const ROLE_PERMISSIONS_MAP = {
  user: [
    PERMISSIONS.PROFILE_READ,
    PERMISSIONS.PROFILE_UPDATE,
    PERMISSIONS.EVENT_READ,
    PERMISSIONS.EVENT_LIST,
    PERMISSIONS.BOOKING_CREATE,
    PERMISSIONS.BOOKING_READ,
    PERMISSIONS.BOOKING_CANCEL,
    PERMISSIONS.TICKET_READ,
    PERMISSIONS.REVIEW_CREATE,
    PERMISSIONS.REVIEW_READ,
    PERMISSIONS.REVIEW_UPDATE,
    PERMISSIONS.NOTIFICATION_READ,
    PERMISSIONS.NOTIFICATION_UPDATE,
    PERMISSIONS.REPORT_CREATE,
    PERMISSIONS.ORGANIZER_APPLY,
  ],
  organizer: [
    PERMISSIONS.PROFILE_READ,
    PERMISSIONS.PROFILE_UPDATE,
    PERMISSIONS.EVENT_CREATE,
    PERMISSIONS.EVENT_READ,
    PERMISSIONS.EVENT_UPDATE,
    PERMISSIONS.EVENT_DELETE,
    PERMISSIONS.EVENT_LIST,
    PERMISSIONS.EVENT_PUBLISH,
    PERMISSIONS.EVENT_CANCEL,
    PERMISSIONS.BOOKING_READ,
    PERMISSIONS.BOOKING_LIST,
    PERMISSIONS.TICKET_GENERATE,
    PERMISSIONS.TICKET_VALIDATE,
    PERMISSIONS.PAYMENT_READ,
    PERMISSIONS.PAYOUT_REQUEST,
    PERMISSIONS.PAYOUT_READ,
    PERMISSIONS.ANALYTICS_VIEW_OWN,
    PERMISSIONS.REVIEW_REPLY,
  ],
  moderator: [
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_BLOCK,
    PERMISSIONS.EVENT_READ,
    PERMISSIONS.EVENT_LIST,
    PERMISSIONS.EVENT_FEATURE,
    PERMISSIONS.REVIEW_MODERATE,
    PERMISSIONS.REVIEW_DELETE,
    PERMISSIONS.REPORT_READ,
    PERMISSIONS.REPORT_UPDATE,
    PERMISSIONS.REPORT_RESOLVE,
    PERMISSIONS.CATEGORY_READ,
    PERMISSIONS.CATEGORY_LIST,
    PERMISSIONS.ORGANIZER_READ,
    PERMISSIONS.ORGANIZER_SUSPEND,
  ],
  admin: [
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.USER_LIST,
    PERMISSIONS.USER_BLOCK,
    PERMISSIONS.USER_VERIFY,
    PERMISSIONS.ORGANIZER_READ,
    PERMISSIONS.ORGANIZER_APPROVE,
    PERMISSIONS.ORGANIZER_REJECT,
    PERMISSIONS.ORGANIZER_SUSPEND,
    PERMISSIONS.CATEGORY_CREATE,
    PERMISSIONS.CATEGORY_UPDATE,
    PERMISSIONS.CATEGORY_DELETE,
    PERMISSIONS.EVENT_FEATURE,
    PERMISSIONS.PAYMENT_READ,
    PERMISSIONS.PAYMENT_LIST,
    PERMISSIONS.PAYOUT_APPROVE,
    PERMISSIONS.PAYOUT_PROCESS,
    PERMISSIONS.ANALYTICS_VIEW_ALL,
    PERMISSIONS.ANALYTICS_EXPORT,
    PERMISSIONS.REPORT_READ,
    PERMISSIONS.REPORT_RESOLVE,
    PERMISSIONS.ADMIN_READ,
    PERMISSIONS.ADMIN_LIST,
    PERMISSIONS.ROLE_ASSIGN,
    PERMISSIONS.ROLE_REVOKE,
    PERMISSIONS.AUDIT_READ,
  ],
  superadmin: [
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.USER_DELETE,
    PERMISSIONS.USER_LIST,
    PERMISSIONS.USER_BLOCK,
    PERMISSIONS.USER_VERIFY,
    PERMISSIONS.ORGANIZER_READ,
    PERMISSIONS.ORGANIZER_APPROVE,
    PERMISSIONS.ORGANIZER_REJECT,
    PERMISSIONS.ORGANIZER_SUSPEND,
    PERMISSIONS.CATEGORY_CREATE,
    PERMISSIONS.CATEGORY_UPDATE,
    PERMISSIONS.CATEGORY_DELETE,
    PERMISSIONS.EVENT_FEATURE,
    PERMISSIONS.PAYMENT_READ,
    PERMISSIONS.PAYMENT_LIST,
    PERMISSIONS.PAYOUT_APPROVE,
    PERMISSIONS.PAYOUT_PROCESS,
    PERMISSIONS.ANALYTICS_VIEW_ALL,
    PERMISSIONS.ANALYTICS_EXPORT,
    PERMISSIONS.REPORT_READ,
    PERMISSIONS.REPORT_RESOLVE,
    PERMISSIONS.ADMIN_CREATE,
    PERMISSIONS.ADMIN_READ,
    PERMISSIONS.ADMIN_UPDATE,
    PERMISSIONS.ADMIN_DELETE,
    PERMISSIONS.ADMIN_LIST,
    PERMISSIONS.ROLE_ASSIGN,
    PERMISSIONS.ROLE_REVOKE,
    PERMISSIONS.ROLE_LIST,
    PERMISSIONS.AUDIT_READ,
    PERMISSIONS.AUDIT_EXPORT,
    PERMISSIONS.SYSTEM_SETTINGS,
    PERMISSIONS.SYSTEM_LOGS,
    PERMISSIONS.SYSTEM_BACKUP,
    PERMISSIONS.SYSTEM_RESTORE,
    PERMISSIONS.SYSTEM_MONITOR,
  ],
};

// Permission groups for better organization
const PERMISSION_GROUPS = {
  USER: "user",
  PROFILE: "profile",
  EVENT: "event",
  BOOKING: "booking",
  TICKET: "ticket",
  PAYMENT: "payment",
  PAYOUT: "payout",
  ORGANIZER: "organizer",
  CATEGORY: "category",
  REVIEW: "review",
  NOTIFICATION: "notification",
  ANALYTICS: "analytics",
  REPORT: "report",
  ADMIN: "admin",
  SYSTEM: "system",
  ROLE: "role",
  AUDIT: "audit",
};

module.exports = {
  PERMISSIONS,
  ROLE_PERMISSIONS_MAP,
  PERMISSION_GROUPS,
};
