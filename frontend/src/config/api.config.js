// frontend/src/config/api.config.js
//
// Central API endpoint constants.
// Import this instead of hardcoding URL strings in components/services.

import authConfig from './auth.config';

export const API_BASE_URL = authConfig.apiBaseUrl;

export const ENDPOINTS = {
  // ── Auth ────────────────────────────────────────────────────────────────────
  AUTH: {
    REGISTER:            '/auth/register',
    LOGIN:               '/auth/login',
    LOGOUT:              '/auth/logout',
    LOGOUT_ALL:          '/auth/logout-all',
    REFRESH_TOKEN:       '/auth/refresh-token',
    ME:                  '/auth/me',
    VERIFY_EMAIL:        '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
    FORGOT_PASSWORD:     '/auth/forgot-password',
    RESET_PASSWORD:      '/auth/reset-password',
    CHANGE_PASSWORD:     '/auth/change-password',
    SESSIONS:            '/auth/sessions',
    SESSION:             (id) => `/auth/sessions/${id}`,
    TWO_FACTOR: {
      SETUP:    '/auth/2fa/setup',
      ENABLE:   '/auth/2fa/enable',
      DISABLE:  '/auth/2fa/disable',
      VERIFY:   '/auth/2fa/verify',
    },
    OAUTH: {
      GOOGLE:   '/auth/oauth/google',
      FACEBOOK: '/auth/oauth/facebook',
    },
  },

  // ── Users ───────────────────────────────────────────────────────────────────
  USERS: {
    PROFILE:         '/users/profile',
    UPDATE_PROFILE:  '/users/profile',
    CHANGE_PASSWORD: '/users/password',
    DELETE_ACCOUNT:  '/users/account',
    SAVED_EVENTS:    '/users/saved-events',
    SAVE_EVENT:      (id) => `/users/saved-events/${id}`,
  },

  // ── Events ──────────────────────────────────────────────────────────────────
  EVENTS: {
    LIST:      '/events',
    FEATURED:  '/events/featured',
    TRENDING:  '/events/trending',
    UPCOMING:  '/events/upcoming',
    DETAIL:    (slug) => `/events/${slug}`,
    TICKETS:   (slug) => `/events/${slug}/tickets`,
    REVIEWS:   (slug) => `/events/${slug}/reviews`,
    RELATED:   (slug) => `/events/${slug}/related`,
  },

  // ── Bookings ─────────────────────────────────────────────────────────────────
  BOOKINGS: {
    LIST:    '/bookings',
    CREATE:  '/bookings',
    DETAIL:  (ref) => `/bookings/${ref}`,
    CANCEL:  (ref) => `/bookings/${ref}/cancel`,
    REFUND:  (ref) => `/bookings/${ref}/refund`,
    TICKETS: (ref) => `/bookings/${ref}/tickets`,
    INVOICE: (ref) => `/bookings/${ref}/invoice`,
  },

  // ── Payments ─────────────────────────────────────────────────────────────────
  PAYMENTS: {
    INTENT:  '/payments/intent',
    VERIFY:  '/payments/verify',
    LIST:    '/payments',
    DETAIL:  (id) => `/payments/${id}`,
    REFUND:  (id) => `/payments/${id}/refund`,
  },

  // ── Tickets ──────────────────────────────────────────────────────────────────
  TICKETS: {
    LIST:      '/tickets',
    DETAIL:    (code) => `/tickets/${code}`,
    DOWNLOAD:  (code) => `/tickets/${code}/download`,
    VALIDATE:  (code) => `/tickets/${code}/validate`,
    TRANSFER:  (code) => `/tickets/${code}/transfer`,
    CANCEL:    (code) => `/tickets/${code}/cancel`,
  },

  // ── Search ───────────────────────────────────────────────────────────────────
  SEARCH: {
    ROOT:         '/search',
    AUTOCOMPLETE: '/search/autocomplete',
    TRENDING:     '/search/trending',
    NEARBY:       '/search/nearby',
  },

  // ── Notifications ────────────────────────────────────────────────────────────
  NOTIFICATIONS: {
    LIST:        '/notifications',
    UNREAD:      '/notifications/unread-count',
    MARK_READ:   (id) => `/notifications/${id}/read`,
    MARK_ALL:    '/notifications/read-all',
    DELETE:      (id) => `/notifications/${id}`,
    PREFERENCES: '/notifications/preferences',
  },

  // ── Organizers ───────────────────────────────────────────────────────────────
  ORGANIZERS: {
    PROFILE:    (slug) => `/organizers/${slug}`,
    EVENTS:     (slug) => `/organizers/${slug}/events`,
    DASHBOARD:  '/organizer/dashboard',
    REVENUE:    '/organizer/revenue',
    ANALYTICS:  '/organizer/analytics',
  },

  // ── Categories ───────────────────────────────────────────────────────────────
  CATEGORIES: {
    LIST:   '/categories',
    DETAIL: (slug) => `/categories/${slug}`,
    SUBS:   (slug) => `/categories/${slug}/subcategories`,
  },

  // ── Reviews ──────────────────────────────────────────────────────────────────
  REVIEWS: {
    CREATE:  '/reviews',
    UPDATE:  (id) => `/reviews/${id}`,
    DELETE:  (id) => `/reviews/${id}`,
    MY:      '/reviews/my',
  },

  // ── Cart ─────────────────────────────────────────────────────────────────────
  CART: {
    ROOT:        '/cart',
    ADD:         '/cart/items',
    UPDATE:      (id) => `/cart/items/${id}`,
    REMOVE:      (id) => `/cart/items/${id}`,
    CLEAR:       '/cart',
    APPLY_PROMO: '/cart/apply-promo',
    REMOVE_PROMO:'/cart/promo',
    CHECKOUT:    '/cart/checkout',
  },
};

export default ENDPOINTS;
