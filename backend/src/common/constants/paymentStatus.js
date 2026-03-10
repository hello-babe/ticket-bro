// ============================================================
//  PAYMENT STATUS CONSTANTS
//  src/common/constants/paymentStatus.js
// ============================================================

const PAYMENT_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
  PARTIALLY_REFUNDED: "partially_refunded",
  CANCELLED: "cancelled",
  EXPIRED: "expired",
  AUTHORIZED: "authorized",
  CAPTURED: "captured",
  VOIDED: "voided",
  DISPUTED: "disputed",
  CHARGEBACK: "chargeback",
};

const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.PENDING]: "Pending",
  [PAYMENT_STATUS.PROCESSING]: "Processing",
  [PAYMENT_STATUS.COMPLETED]: "Completed",
  [PAYMENT_STATUS.FAILED]: "Failed",
  [PAYMENT_STATUS.REFUNDED]: "Refunded",
  [PAYMENT_STATUS.PARTIALLY_REFUNDED]: "Partially Refunded",
  [PAYMENT_STATUS.CANCELLED]: "Cancelled",
  [PAYMENT_STATUS.EXPIRED]: "Expired",
  [PAYMENT_STATUS.AUTHORIZED]: "Authorized",
  [PAYMENT_STATUS.CAPTURED]: "Captured",
  [PAYMENT_STATUS.VOIDED]: "Voided",
  [PAYMENT_STATUS.DISPUTED]: "Disputed",
  [PAYMENT_STATUS.CHARGEBACK]: "Chargeback",
};

const PAYMENT_STATUS_COLORS = {
  [PAYMENT_STATUS.PENDING]: "warning",
  [PAYMENT_STATUS.PROCESSING]: "info",
  [PAYMENT_STATUS.COMPLETED]: "success",
  [PAYMENT_STATUS.FAILED]: "error",
  [PAYMENT_STATUS.REFUNDED]: "default",
  [PAYMENT_STATUS.PARTIALLY_REFUNDED]: "default",
  [PAYMENT_STATUS.CANCELLED]: "error",
  [PAYMENT_STATUS.EXPIRED]: "default",
  [PAYMENT_STATUS.AUTHORIZED]: "info",
  [PAYMENT_STATUS.CAPTURED]: "success",
  [PAYMENT_STATUS.VOIDED]: "error",
  [PAYMENT_STATUS.DISPUTED]: "warning",
  [PAYMENT_STATUS.CHARGEBACK]: "error",
};

const PAYMENT_METHODS = {
  CREDIT_CARD: "credit_card",
  DEBIT_CARD: "debit_card",
  PAYPAL: "paypal",
  STRIPE: "stripe",
  RAZORPAY: "razorpay",
  BANK_TRANSFER: "bank_transfer",
  CASH: "cash",
  WALLET: "wallet",
  CRYPTO: "crypto",
};

const PAYMENT_TYPES = {
  BOOKING: "booking",
  REFUND: "refund",
  PAYOUT: "payout",
  DEPOSIT: "deposit",
  WITHDRAWAL: "withdrawal",
};

module.exports = {
  PAYMENT_STATUS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
  PAYMENT_METHODS,
  PAYMENT_TYPES,
};
