// frontend/src/types/auth.types.js

/**
 * User roles for role-based access control.
 * FIX: Added SUPER_ADMIN and MODERATOR to match backend ROLES enum.
 * AppRoutes.jsx and ProtectedRoute.jsx both reference 'super_admin' as a string —
 * now they can use UserRole.SUPER_ADMIN instead.
 */
export const UserRole = {
  USER:        'user',
  ORGANIZER:   'organizer',
  MODERATOR:   'moderator',
  ADMIN:       'admin',
  SUPER_ADMIN: 'super_admin',
  GUEST:       'guest',
};

/**
 * User permissions
 */
export const UserPermission = {
  // Event permissions
  CREATE_EVENT:   'create_event',
  EDIT_EVENT:     'edit_event',
  DELETE_EVENT:   'delete_event',
  PUBLISH_EVENT:  'publish_event',
  MANAGE_EVENTS:  'manage_events',

  // Ticket permissions
  CREATE_TICKET:  'create_ticket',
  EDIT_TICKET:    'edit_ticket',
  DELETE_TICKET:  'delete_ticket',
  MANAGE_TICKETS: 'manage_tickets',

  // Booking permissions
  VIEW_BOOKINGS:   'view_bookings',
  MANAGE_BOOKINGS: 'manage_bookings',
  CANCEL_BOOKING:  'cancel_booking',
  REFUND_BOOKING:  'refund_booking',

  // User permissions
  VIEW_USERS:   'view_users',
  MANAGE_USERS: 'manage_users',
  BLOCK_USERS:  'block_users',

  // Payment permissions
  VIEW_PAYMENTS:   'view_payments',
  MANAGE_PAYMENTS: 'manage_payments',
  REFUND_PAYMENT:  'refund_payment',

  // Content permissions
  MANAGE_CATEGORIES: 'manage_categories',
  MANAGE_VENUES:     'manage_venues',
  MANAGE_REVIEWS:    'manage_reviews',

  // System permissions
  MANAGE_SETTINGS: 'manage_settings',
  VIEW_ANALYTICS:  'view_analytics',
  MANAGE_SYSTEM:   'manage_system',
};

export default { UserRole, UserPermission };
