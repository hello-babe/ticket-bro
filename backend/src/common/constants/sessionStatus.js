// ============================================================
//  SESSION STATUS CONSTANTS
//  src/common/constants/sessionStatus.js
// ============================================================

const SESSION_STATUS = {
  ACTIVE: "active",
  EXPIRED: "expired",
  REVOKED: "revoked",
  TERMINATED: "terminated",
};

const SESSION_STATUS_LABELS = {
  [SESSION_STATUS.ACTIVE]: "Active",
  [SESSION_STATUS.EXPIRED]: "Expired",
  [SESSION_STATUS.REVOKED]: "Revoked",
  [SESSION_STATUS.TERMINATED]: "Terminated",
};

const SESSION_STATUS_COLORS = {
  [SESSION_STATUS.ACTIVE]: "success",
  [SESSION_STATUS.EXPIRED]: "default",
  [SESSION_STATUS.REVOKED]: "error",
  [SESSION_STATUS.TERMINATED]: "error",
};

module.exports = {
  SESSION_STATUS,
  SESSION_STATUS_LABELS,
  SESSION_STATUS_COLORS,
};
