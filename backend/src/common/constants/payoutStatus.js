// ============================================================
//  PAYOUT STATUS CONSTANTS
//  src/common/constants/payoutStatus.js
// ============================================================

const PAYOUT_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
  CANCELLED: "cancelled",
  ON_HOLD: "on_hold",
  APPROVED: "approved",
  REJECTED: "rejected",
};

const PAYOUT_STATUS_LABELS = {
  [PAYOUT_STATUS.PENDING]: "Pending",
  [PAYOUT_STATUS.PROCESSING]: "Processing",
  [PAYOUT_STATUS.COMPLETED]: "Completed",
  [PAYOUT_STATUS.FAILED]: "Failed",
  [PAYOUT_STATUS.CANCELLED]: "Cancelled",
  [PAYOUT_STATUS.ON_HOLD]: "On Hold",
  [PAYOUT_STATUS.APPROVED]: "Approved",
  [PAYOUT_STATUS.REJECTED]: "Rejected",
};

const PAYOUT_STATUS_COLORS = {
  [PAYOUT_STATUS.PENDING]: "warning",
  [PAYOUT_STATUS.PROCESSING]: "info",
  [PAYOUT_STATUS.COMPLETED]: "success",
  [PAYOUT_STATUS.FAILED]: "error",
  [PAYOUT_STATUS.CANCELLED]: "error",
  [PAYOUT_STATUS.ON_HOLD]: "warning",
  [PAYOUT_STATUS.APPROVED]: "success",
  [PAYOUT_STATUS.REJECTED]: "error",
};

const PAYOUT_METHODS = {
  BANK_TRANSFER: "bank_transfer",
  PAYPAL: "paypal",
  STRIPE: "stripe",
  RAZORPAY: "razorpay",
  WALLET: "wallet",
};

module.exports = {
  PAYOUT_STATUS,
  PAYOUT_STATUS_LABELS,
  PAYOUT_STATUS_COLORS,
  PAYOUT_METHODS,
};
