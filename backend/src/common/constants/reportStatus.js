// ============================================================
//  REPORT STATUS CONSTANTS
//  src/common/constants/reportStatus.js
// ============================================================

const REPORT_STATUS = {
  PENDING: "pending",
  UNDER_REVIEW: "under_review",
  RESOLVED: "resolved",
  DISMISSED: "dismissed",
  ESCALATED: "escalated",
};

const REPORT_STATUS_LABELS = {
  [REPORT_STATUS.PENDING]: "Pending",
  [REPORT_STATUS.UNDER_REVIEW]: "Under Review",
  [REPORT_STATUS.RESOLVED]: "Resolved",
  [REPORT_STATUS.DISMISSED]: "Dismissed",
  [REPORT_STATUS.ESCALATED]: "Escalated",
};

const REPORT_STATUS_COLORS = {
  [REPORT_STATUS.PENDING]: "warning",
  [REPORT_STATUS.UNDER_REVIEW]: "info",
  [REPORT_STATUS.RESOLVED]: "success",
  [REPORT_STATUS.DISMISSED]: "default",
  [REPORT_STATUS.ESCALATED]: "error",
};

const REPORT_TYPES = {
  EVENT: "event",
  USER: "user",
  ORGANIZER: "organizer",
  REVIEW: "review",
  COMMENT: "comment",
  PAYMENT: "payment",
  OTHER: "other",
};

module.exports = {
  REPORT_STATUS,
  REPORT_STATUS_LABELS,
  REPORT_STATUS_COLORS,
  REPORT_TYPES,
};
