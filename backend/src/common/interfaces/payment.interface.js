// ============================================================
//  PAYMENT INTERFACE
//  src/common/interfaces/payment.interface.js
// ============================================================

/**
 * @typedef {Object} IPayment
 * @property {string} _id - Payment ID
 * @property {string} paymentNumber - Unique payment number
 * @property {Object} user - User reference
 * @property {string} user.id - User ID
 * @property {string} user.email - User email
 * @property {string} user.name - User name
 * @property {Object} booking - Booking reference
 * @property {string} booking.id - Booking ID
 * @property {string} booking.number - Booking number
 * @property {number} amount - Payment amount
 * @property {string} currency - Payment currency
 * @property {string} status - Payment status
 * @property {string} method - Payment method
 * @property {string} gateway - Payment gateway
 * @property {Object} gatewayResponse - Gateway response
 * @property {string} transactionId - Gateway transaction ID
 * @property {string} paymentIntentId - Payment intent ID
 * @property {Object} cardDetails - Card details (masked)
 * @property {string} cardDetails.last4 - Last 4 digits
 * @property {string} cardDetails.brand - Card brand
 * @property {Object} refundDetails - Refund details
 * @property {boolean} refundDetails.isRefunded - Refunded flag
 * @property {number} refundDetails.amount - Refund amount
 * @property {Date} refundDetails.date - Refund date
 * @property {string} refundDetails.reason - Refund reason
 * @property {Object} metadata - Additional metadata
 * @property {Date} paidAt - Payment date
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Update timestamp
 */

/**
 * @typedef {Object} IPaymentCreate
 * @property {string} bookingId - Booking ID
 * @property {number} amount - Payment amount
 * @property {string} currency - Payment currency
 * @property {string} method - Payment method
 * @property {string} gateway - Payment gateway
 * @property {Object} paymentDetails - Gateway-specific details
 */

/**
 * @typedef {Object} IPaymentRefund
 * @property {number} amount - Refund amount
 * @property {string} reason - Refund reason
 * @property {boolean} [fullRefund] - Full refund flag
 */

/**
 * @typedef {Object} IPaymentResponse
 * @property {string} id - Payment ID
 * @property {string} paymentNumber - Payment number
 * @property {Object} booking - Booking info
 * @property {number} amount - Payment amount
 * @property {string} currency - Currency
 * @property {string} status - Payment status
 * @property {string} method - Payment method
 * @property {Date} paidAt - Payment date
 */

module.exports = {};
