// ============================================================
//  BOOKING INTERFACE
//  src/common/interfaces/booking.interface.js
// ============================================================

/**
 * @typedef {Object} IBooking
 * @property {string} _id - Booking ID
 * @property {string} bookingNumber - Unique booking number
 * @property {Object} user - User reference
 * @property {string} user.id - User ID
 * @property {string} user.email - User email
 * @property {string} user.name - User name
 * @property {Object} event - Event reference
 * @property {string} event.id - Event ID
 * @property {string} event.title - Event title
 * @property {Date} event.startDate - Event start date
 * @property {Date} event.endDate - Event end date
 * @property {Object[]} items - Booking items
 * @property {string} items.ticketTypeId - Ticket type ID
 * @property {string} items.ticketTypeName - Ticket type name
 * @property {number} items.quantity - Ticket quantity
 * @property {number} items.unitPrice - Unit price
 * @property {number} items.totalPrice - Total price
 * @property {Object[]} tickets - Ticket references
 * @property {Object} pricing - Pricing details
 * @property {number} pricing.subtotal - Subtotal
 * @property {number} pricing.discount - Discount amount
 * @property {number} pricing.tax - Tax amount
 * @property {number} pricing.total - Total amount
 * @property {string} pricing.currency - Currency
 * @property {Object} payment - Payment details
 * @property {string} payment.id - Payment ID
 * @property {string} payment.status - Payment status
 * @property {string} payment.method - Payment method
 * @property {Date} payment.date - Payment date
 * @property {Object} attendee - Primary attendee
 * @property {string} attendee.name - Attendee name
 * @property {string} attendee.email - Attendee email
 * @property {string} attendee.phone - Attendee phone
 * @property {Object[]} additionalAttendees - Additional attendees
 * @property {Object} cancellation - Cancellation details
 * @property {boolean} cancellation.isCancelled - Cancelled flag
 * @property {Date} cancellation.date - Cancellation date
 * @property {string} cancellation.reason - Cancellation reason
 * @property {Object} refund - Refund details
 * @property {string} status - Booking status
 * @property {Object} metadata - Additional metadata
 * @property {Date} expiresAt - Expiration time
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Update timestamp
 */

/**
 * @typedef {Object} IBookingCreate
 * @property {string} eventId - Event ID
 * @property {Object[]} items - Booking items
 * @property {string} items.ticketTypeId - Ticket type ID
 * @property {number} items.quantity - Ticket quantity
 * @property {Object} attendee - Primary attendee
 * @property {string} attendee.name - Attendee name
 * @property {string} attendee.email - Attendee email
 * @property {string} attendee.phone - Attendee phone
 * @property {Object[]} [additionalAttendees] - Additional attendees
 * @property {string} [promoCode] - Promo code
 * @property {Object} [metadata] - Additional metadata
 */

/**
 * @typedef {Object} IBookingUpdate
 * @property {Object[]} [items] - Updated items
 * @property {Object} [attendee] - Updated attendee
 * @property {Object[]} [additionalAttendees] - Updated attendees
 */

/**
 * @typedef {Object} IBookingResponse
 * @property {string} id - Booking ID
 * @property {string} bookingNumber - Booking number
 * @property {Object} user - User info
 * @property {Object} event - Event info
 * @property {Object[]} items - Booking items
 * @property {Object} pricing - Pricing details
 * @property {Object} payment - Payment info
 * @property {Object} attendee - Primary attendee
 * @property {Object[]} tickets - Tickets
 * @property {string} status - Booking status
 * @property {Date} createdAt - Creation date
 */

module.exports = {};
