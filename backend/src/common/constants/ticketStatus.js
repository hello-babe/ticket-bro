// ============================================================
//  TICKET STATUS CONSTANTS
//  src/common/constants/ticketStatus.js
// ============================================================

const TICKET_STATUS = {
  ACTIVE: "active",
  USED: "used",
  EXPIRED: "expired",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
  TRANSFERRED: "transferred",
  PENDING: "pending",
  RESERVED: "reserved",
  WAITLIST: "waitlist",
};

const TICKET_STATUS_LABELS = {
  [TICKET_STATUS.ACTIVE]: "Active",
  [TICKET_STATUS.USED]: "Used",
  [TICKET_STATUS.EXPIRED]: "Expired",
  [TICKET_STATUS.CANCELLED]: "Cancelled",
  [TICKET_STATUS.REFUNDED]: "Refunded",
  [TICKET_STATUS.TRANSFERRED]: "Transferred",
  [TICKET_STATUS.PENDING]: "Pending",
  [TICKET_STATUS.RESERVED]: "Reserved",
  [TICKET_STATUS.WAITLIST]: "Waitlist",
};

const TICKET_STATUS_COLORS = {
  [TICKET_STATUS.ACTIVE]: "success",
  [TICKET_STATUS.USED]: "default",
  [TICKET_STATUS.EXPIRED]: "default",
  [TICKET_STATUS.CANCELLED]: "error",
  [TICKET_STATUS.REFUNDED]: "warning",
  [TICKET_STATUS.TRANSFERRED]: "info",
  [TICKET_STATUS.PENDING]: "warning",
  [TICKET_STATUS.RESERVED]: "info",
  [TICKET_STATUS.WAITLIST]: "default",
};

const TICKET_TYPES = {
  GENERAL: "general",
  VIP: "vip",
  VVIP: "vvip",
  EARLY_BIRD: "early_bird",
  GROUP: "group",
  STUDENT: "student",
  SENIOR: "senior",
  COMPLIMENTARY: "complimentary",
  PRESS: "press",
  STAFF: "staff",
};

module.exports = {
  TICKET_STATUS,
  TICKET_STATUS_LABELS,
  TICKET_STATUS_COLORS,
  TICKET_TYPES,
};
