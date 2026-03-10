// ============================================================
//  USER INTERFACE
//  src/common/interfaces/user.interface.js
// ============================================================

/**
 * ============================================================
 * MAIN USER ENTITY (Database Shape)
 * ============================================================
 */

/**
 * @typedef {Object} IUser
 * @property {string} _id - Unique user ID
 *
 * // ── Identity ─────────────────────────────────────────────
 * @property {string} email - User email address
 * @property {string} phone - User phone number
 * @property {string} firstName - First name
 * @property {string} lastName - Last name
 * @property {string} role - User role
 *
 * // ── Security (PRIVATE — never expose in API) ─────────────
 * @property {string} password - Hashed password (private)
 * @property {boolean} emailVerified - Email verification status
 * @property {boolean} phoneVerified - Phone verification status
 * @property {boolean} twoFactorEnabled - 2FA enabled flag
 * @property {string} [twoFactorSecret] - 2FA secret (private)
 *
 * // ── Profile ──────────────────────────────────────────────
 * @property {Object} profile - User profile info
 * @property {string} [profile.avatar] - Avatar URL
 * @property {string} [profile.bio] - Short bio
 * @property {Date}   [profile.dateOfBirth] - Date of birth
 * @property {string} [profile.gender] - Gender
 *
 * @property {Object} [profile.address] - Address info
 * @property {string} [profile.address.street] - Street
 * @property {string} [profile.address.city] - City
 * @property {string} [profile.address.state] - State/Region
 * @property {string} [profile.address.country] - Country
 * @property {string} [profile.address.zipCode] - ZIP/Postal code
 *
 * // ── Preferences ──────────────────────────────────────────
 * @property {Object} preferences - User preferences
 * @property {string[]} preferences.categories - Preferred categories
 * @property {boolean} preferences.emailNotifications - Email notifications
 * @property {boolean} preferences.pushNotifications - Push notifications
 * @property {boolean} preferences.smsNotifications - SMS notifications
 *
 * // ── Stats ────────────────────────────────────────────────
 * @property {Object} stats - User activity stats
 * @property {number} stats.totalBookings - Total bookings
 * @property {number} stats.totalSpent - Total spent amount
 * @property {number} stats.loyaltyPoints - Loyalty points
 * @property {Date}   stats.memberSince - Membership start date
 *
 * // ── System Fields ────────────────────────────────────────
 * @property {string} status - Account status (ACTIVE, SUSPENDED, etc.)
 * @property {Date} lastLoginAt - Last login timestamp
 * @property {Date} passwordChangedAt - Password last changed
 * @property {Date} createdAt - Created timestamp
 * @property {Date} updatedAt - Updated timestamp
 * @property {Date|null} [deletedAt] - Soft delete timestamp
 */


/**
 * ============================================================
 * CREATE USER PAYLOAD
 * ============================================================
 */

/**
 * @typedef {Object} IUserCreate
 * @property {string} email - User email
 * @property {string} phone - User phone number
 * @property {string} firstName - First name
 * @property {string} lastName - Last name
 * @property {string} password - Plain password (will be hashed)
 * @property {string} [role="USER"] - Role (optional)
 */


/**
 * ============================================================
 * UPDATE USER PAYLOAD (PATCH)
 * ============================================================
 */

/**
 * @typedef {Object} IUserUpdate
 * @property {string} [firstName]
 * @property {string} [lastName]
 * @property {string} [phone]
 * @property {Object} [profile]
 * @property {string} [profile.avatar]
 * @property {string} [profile.bio]
 * @property {Date}   [profile.dateOfBirth]
 * @property {string} [profile.gender]
 * @property {Object} [profile.address]
 * @property {Object} [preferences]
 */


/**
 * ============================================================
 * LOGIN PAYLOAD
 * ============================================================
 */

/**
 * @typedef {Object} IUserLogin
 * @property {string} email
 * @property {string} password
 * @property {string} [twoFactorCode]
 */


/**
 * ============================================================
 * SAFE API RESPONSE (Public/Client)
 * ============================================================
 */

/**
 * @typedef {Object} IUserResponse
 * @property {string} id
 * @property {string} email
 * @property {string} phone
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} fullName
 * @property {string} role
 * @property {Object} profile
 * @property {Object} preferences
 * @property {Object} stats
 * @property {string} status
 * @property {Date} createdAt
 */


module.exports = {};