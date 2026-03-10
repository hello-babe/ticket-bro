// ============================================================
//  NOTIFICATION TYPES CONSTANTS
//  src/common/constants/notificationTypes.js
// ============================================================

const NOTIFICATION_TYPES = {
  // Booking notifications
  BOOKING_CONFIRMED: "booking_confirmed",
  BOOKING_CANCELLED: "booking_cancelled",
  BOOKING_REMINDER: "booking_reminder",
  BOOKING_UPDATED: "booking_updated",

  // Payment notifications
  PAYMENT_SUCCESS: "payment_success",
  PAYMENT_FAILED: "payment_failed",
  PAYMENT_REFUNDED: "payment_refunded",

  // Event notifications
  EVENT_CREATED: "event_created",
  EVENT_UPDATED: "event_updated",
  EVENT_CANCELLED: "event_cancelled",
  EVENT_REMINDER: "event_reminder",
  EVENT_PUBLISHED: "event_published",

  // Ticket notifications
  TICKET_ISSUED: "ticket_issued",
  TICKET_TRANSFERRED: "ticket_transferred",
  TICKET_CANCELLED: "ticket_cancelled",

  // Account notifications
  ACCOUNT_VERIFIED: "account_verified",
  ACCOUNT_SUSPENDED: "account_suspended",
  ACCOUNT_BANNED: "account_banned",
  PASSWORD_CHANGED: "password_changed",
  PASSWORD_RESET: "password_reset",
  EMAIL_VERIFIED: "email_verified",

  // Organizer notifications
  ORGANIZER_APPROVED: "organizer_approved",
  ORGANIZER_REJECTED: "organizer_rejected",
  ORGANIZER_APPLICATION: "organizer_application",

  // Payout notifications
  PAYOUT_PROCESSED: "payout_processed",
  PAYOUT_FAILED: "payout_failed",
  PAYOUT_APPROVED: "payout_approved",

  // Review notifications
  REVIEW_RECEIVED: "review_received",
  REVIEW_REPLIED: "review_replied",

  // System notifications
  SYSTEM_ALERT: "system_alert",
  MAINTENANCE: "maintenance",
  UPDATE_AVAILABLE: "update_available",

  // Marketing notifications
  PROMOTION: "promotion",
  OFFER: "offer",
  NEWSLETTER: "newsletter",
};

const NOTIFICATION_CHANNELS = {
  EMAIL: "email",
  SMS: "sms",
  PUSH: "push",
  IN_APP: "in_app",
  WEBHOOK: "webhook",
};

const NOTIFICATION_PRIORITY = {
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
};

const NOTIFICATION_CATEGORIES = {
  TRANSACTIONAL: "transactional",
  PROMOTIONAL: "promotional",
  SYSTEM: "system",
  ALERT: "alert",
};

module.exports = {
  NOTIFICATION_TYPES,
  NOTIFICATION_CHANNELS,
  NOTIFICATION_PRIORITY,
  NOTIFICATION_CATEGORIES,
};
