/**
 * tokenManager.js
 *
 * Secure in-memory token management with PKCE-safe token rotation support.
 *
 * SECURITY MODEL (2026 best practices):
 * ┌─────────────────┬──────────────────────────────────────────────────────┐
 * │ Access Token    │ Module-level variable only (never persisted)         │
 * │                 │ Lost on page reload → silent refresh via cookie       │
 * ├─────────────────┼──────────────────────────────────────────────────────┤
 * │ Refresh Token   │ HttpOnly, Secure, SameSite=Strict cookie             │
 * │                 │ Managed entirely by server. JS cannot touch it.      │
 * ├─────────────────┼──────────────────────────────────────────────────────┤
 * │ User Object     │ sessionStorage (tab-scoped, cleared on close)        │
 * │                 │ Unverified until server confirms via /auth/me         │
 * └─────────────────┴──────────────────────────────────────────────────────┘
 *
 * RELOAD FLOW:
 *   1. Access token is gone (was in memory).
 *   2. sessionStorage has the cached user → AuthProvider calls fetchMe().
 *   3. GET /auth/me → 401 → axios interceptor fires.
 *   4. POST /auth/refresh-token (browser auto-sends httpOnly cookie).
 *   5. Server returns new accessToken in body, rotates refresh cookie.
 *   6. Access token stored in memory, /auth/me retried — transparent to user.
 */

// ── In-memory access token ────────────────────────────────────────────────────
// Module-level singleton — survives React re-renders, wiped on page reload.
let _accessToken = null;
let _tokenExpiresAt = null; // Unix timestamp (ms) for proactive refresh

// ── Proactive refresh callback ────────────────────────────────────────────────
// Register a callback to proactively refresh the token ~1 min before expiry.
let _refreshCallback = null;
let _refreshTimer = null;

const scheduleProactiveRefresh = (expiresInSeconds) => {
  if (_refreshTimer) clearTimeout(_refreshTimer);
  if (!_refreshCallback || !expiresInSeconds) return;

  // Refresh 60 seconds before expiry (or immediately if < 60s left)
  const refreshInMs = Math.max((expiresInSeconds - 60) * 1000, 0);

  _refreshTimer = setTimeout(() => {
    _refreshCallback?.();
  }, refreshInMs);
};

const tokenManager = {
  // ── Access Token ─────────────────────────────────────────────────────────────

  /**
   * Get the current in-memory access token.
   * Returns null if not set (triggers axios interceptor on next request).
   */
  getAccessToken: () => _accessToken,

  /**
   * Store access token in memory and schedule proactive refresh.
   * @param {string} token - JWT access token
   * @param {number} [expiresIn] - Seconds until expiry (for proactive refresh)
   */
  setAccessToken: (token, expiresIn) => {
    _accessToken = token;
    if (expiresIn) {
      _tokenExpiresAt = Date.now() + expiresIn * 1000;
      scheduleProactiveRefresh(expiresIn);
    }
  },

  /** Remove access token from memory */
  removeAccessToken: () => {
    _accessToken = null;
    _tokenExpiresAt = null;
    if (_refreshTimer) {
      clearTimeout(_refreshTimer);
      _refreshTimer = null;
    }
  },

  /**
   * Check if the access token is still valid (with 30s buffer).
   * Returns false if no token or if expiry is within 30 seconds.
   */
  isTokenValid: () => {
    if (!_accessToken) return false;
    if (!_tokenExpiresAt) return true; // No expiry info, assume valid
    return _tokenExpiresAt - Date.now() > 30_000; // 30s buffer
  },

  /**
   * Register a callback for proactive token refresh.
   * Called ~60 seconds before the access token expires.
   * @param {Function} callback - Async function that performs the refresh
   */
  onRefreshNeeded: (callback) => {
    _refreshCallback = callback;
  },

  // ── Refresh Token (no-ops — server-managed cookie) ────────────────────────
  // These exist so legacy call sites don't break. The refresh token lives
  // exclusively in the httpOnly cookie managed by the server.
  getRefreshToken: () => null,
  setRefreshToken: () => {},
  removeRefreshToken: () => {},

  // ── Bulk helpers ──────────────────────────────────────────────────────────

  /**
   * Set tokens from a login/refresh response.
   * Only stores the access token client-side; refresh token is in the cookie.
   * @param {Object} tokens - { accessToken, expiresIn? }
   */
  setTokens: ({ accessToken, expiresIn } = {}) => {
    if (accessToken) {
      tokenManager.setAccessToken(accessToken, expiresIn);
    }
  },

  /** Clear all client-side token state */
  clearTokens: () => {
    tokenManager.removeAccessToken();
  },
};

export default tokenManager;
