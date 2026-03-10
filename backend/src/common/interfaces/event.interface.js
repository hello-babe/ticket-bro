// ============================================================
//  EVENT INTERFACE
//  src/common/interfaces/event.interface.js
// ============================================================

/**
 * @typedef {Object} IEvent
 * @property {string} _id - Event ID
 * @property {string} title - Event title
 * @property {string} slug - URL-friendly slug
 * @property {string} description - Event description
 * @property {string} shortDescription - Short description
 * @property {Object} organizer - Organizer reference
 * @property {string} organizer.id - Organizer ID
 * @property {string} organizer.name - Organizer name
 * @property {Object} category - Category reference
 * @property {string} category.id - Category ID
 * @property {string} category.name - Category name
 * @property {Object[]} subcategories - Subcategories
 * @property {Object[]} tags - Event tags
 * @property {Object} location - Event location
 * @property {string} location.venue - Venue name
 * @property {string} location.address - Street address
 * @property {string} location.city - City
 * @property {string} location.state - State
 * @property {string} location.country - Country
 * @property {string} location.zipCode - ZIP code
 * @property {Object} location.coordinates - Geo coordinates
 * @property {Date} startDate - Event start date
 * @property {Date} endDate - Event end date
 * @property {string} timezone - Event timezone
 * @property {Object[]} images - Event images
 * @property {string} images.url - Image URL
 * @property {string} images.caption - Image caption
 * @property {boolean} images.isPrimary - Primary image flag
 * @property {Object} capacity - Event capacity
 * @property {number} capacity.total - Total capacity
 * @property {number} capacity.remaining - Remaining spots
 * @property {number} capacity.sold - Sold tickets
 * @property {Object[]} ticketTypes - Available ticket types
 * @property {Object} pricing - Pricing information
 * @property {number} pricing.min - Minimum price
 * @property {number} pricing.max - Maximum price
 * @property {string} pricing.currency - Currency
 * @property {Object} settings - Event settings
 * @property {boolean} settings.isPrivate - Private event flag
 * @property {boolean} settings.isFeatured - Featured event flag
 * @property {boolean} settings.allowWaitlist - Waitlist enabled
 * @property {boolean} settings.allowTransfers - Transfers allowed
 * @property {number} settings.maxTicketsPerOrder - Max tickets per order
 * @property {Object} cancellationPolicy - Cancellation policy
 * @property {string} status - Event status
 * @property {number} views - View count
 * @property {number} likes - Like count
 * @property {number} shares - Share count
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Update timestamp
 */

/**
 * @typedef {Object} IEventCreate
 * @property {string} title - Event title
 * @property {string} description - Event description
 * @property {string} shortDescription - Short description
 * @property {string} organizerId - Organizer ID
 * @property {string} categoryId - Category ID
 * @property {string[]} subcategoryIds - Subcategory IDs
 * @property {string[]} tagIds - Tag IDs
 * @property {Object} location - Event location
 * @property {Date} startDate - Event start date
 * @property {Date} endDate - Event end date
 * @property {string} timezone - Event timezone
 * @property {Object[]} ticketTypes - Ticket types
 * @property {Object} settings - Event settings
 */

/**
 * @typedef {Object} IEventUpdate
 * @property {string} [title] - Event title
 * @property {string} [description] - Event description
 * @property {string} [shortDescription] - Short description
 * @property {string} [categoryId] - Category ID
 * @property {string[]} [subcategoryIds] - Subcategory IDs
 * @property {string[]} [tagIds] - Tag IDs
 * @property {Object} [location] - Event location
 * @property {Date} [startDate] - Event start date
 * @property {Date} [endDate] - Event end date
 * @property {string} [timezone] - Event timezone
 * @property {Object[]} [ticketTypes] - Ticket types
 * @property {Object} [settings] - Event settings
 * @property {string} [status] - Event status
 */

/**
 * @typedef {Object} IEventResponse
 * @property {string} id - Event ID
 * @property {string} title - Event title
 * @property {string} slug - Event slug
 * @property {string} description - Event description
 * @property {Object} organizer - Organizer info
 * @property {Object} category - Category info
 * @property {Object} location - Location info
 * @property {Date} startDate - Start date
 * @property {Date} endDate - End date
 * @property {Object[]} images - Event images
 * @property {Object} capacity - Capacity info
 * @property {Object[]} ticketTypes - Ticket types
 * @property {Object} pricing - Pricing info
 * @property {string} status - Event status
 * @property {number} views - View count
 * @property {number} likes - Like count
 */

module.exports = {};
