// ============================================================
//  ORGANIZER INTERFACE
//  src/common/interfaces/organizer.interface.js
// ============================================================

/**
 * @typedef {Object} IOrganizer
 * @property {string} _id - Organizer ID
 * @property {string} name - Organizer name
 * @property {string} email - Contact email
 * @property {string} phone - Contact phone
 * @property {string} website - Website URL
 * @property {string} logo - Logo URL
 * @property {string} coverImage - Cover image URL
 * @property {string} description - Organizer description
 * @property {string} bio - Short bio
 * @property {Object} address - Physical address
 * @property {string} address.street - Street address
 * @property {string} address.city - City
 * @property {string} address.state - State
 * @property {string} address.country - Country
 * @property {string} address.zipCode - ZIP code
 * @property {Object} contact - Contact person
 * @property {string} contact.name - Contact person name
 * @property {string} contact.email - Contact person email
 * @property {string} contact.phone - Contact person phone
 * @property {Object} verification - Verification status
 * @property {boolean} verification.isVerified - Verified flag
 * @property {Date} verification.verifiedAt - Verification date
 * @property {string} verification.documents - Verification documents
 * @property {Object} bankAccount - Bank account details
 * @property {string} bankAccount.accountName - Account name
 * @property {string} bankAccount.accountNumber - Account number
 * @property {string} bankAccount.bankName - Bank name
 * @property {string} bankAccount.branchCode - Branch code
 * @property {string} bankAccount.swiftCode - SWIFT code
 * @property {Object} paypal - PayPal details
 * @property {string} paypal.email - PayPal email
 * @property {Object} stripe - Stripe details
 * @property {string} stripe.accountId - Stripe account ID
 * @property {Object} settings - Organizer settings
 * @property {boolean} settings.emailNotifications - Email notifications
 * @property {boolean} settings.smsNotifications - SMS notifications
 * @property {boolean} settings.pushNotifications - Push notifications
 * @property {Object} stats - Organizer stats
 * @property {number} stats.totalEvents - Total events
 * @property {number} stats.totalBookings - Total bookings
 * @property {number} stats.totalRevenue - Total revenue
 * @property {number} stats.averageRating - Average rating
 * @property {number} stats.followers - Follower count
 * @property {string} status - Organizer status
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Update timestamp
 */

/**
 * @typedef {Object} IOrganizerCreate
 * @property {string} name - Organizer name
 * @property {string} email - Contact email
 * @property {string} phone - Contact phone
 * @property {string} description - Organizer description
 * @property {Object} address - Physical address
 * @property {Object} contact - Contact person
 */

/**
 * @typedef {Object} IOrganizerUpdate
 * @property {string} [name] - Organizer name
 * @property {string} [email] - Contact email
 * @property {string} [phone] - Contact phone
 * @property {string} [website] - Website URL
 * @property {string} [description] - Organizer description
 * @property {Object} [address] - Physical address
 * @property {Object} [contact] - Contact person
 * @property {Object} [bankAccount] - Bank account details
 * @property {Object} [paypal] - PayPal details
 * @property {Object} [settings] - Organizer settings
 */

/**
 * @typedef {Object} IOrganizerResponse
 * @property {string} id - Organizer ID
 * @property {string} name - Organizer name
 * @property {string} email - Contact email
 * @property {string} phone - Contact phone
 * @property {string} logo - Logo URL
 * @property {string} description - Description
 * @property {Object} address - Address
 * @property {Object} verification - Verification status
 * @property {Object} stats - Organizer stats
 * @property {string} status - Organizer status
 */

module.exports = {};
