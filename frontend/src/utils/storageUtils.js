// frontend/src/utils/storageUtils.js
//
// Centralised token + user storage — secure design:
//
//   ACCESS TOKEN  → in-memory JS variable only (lost on page reload by design)
//                   Invisible to XSS; silently refreshed via httpOnly cookie.
//
//   REFRESH TOKEN → httpOnly cookie managed entirely by the server.
//                   JS CANNOT read it. Browser sends it automatically to
//                   /api/v1/auth/refresh-token via withCredentials:true.
//                   We never touch it here.
//
//   USER OBJECT   → sessionStorage (survives reload, cleared on tab close)
//                   On reload: AuthContext detects sessionStorage user, calls
//                   fetchMe() which fires /auth/me → 401 → axios interceptor
//                   → POST /auth/refresh-token (cookie auto-sent) → new access
//                   token stored in memory → /auth/me retried → success.
//
// FIX: Previously stored both tokens in localStorage, exposing the 7-day
// refresh token to any XSS payload. Now only non-sensitive data (user object)
// is persisted, and only for the duration of the browser tab.

import authConfig from '../config/auth.config';

const { user: USER_KEY } = authConfig.storage;

// ── In-memory access token ─────────────────────────────────────────────────────
// Stored as a module-level variable — survives React re-renders but is wiped
// on page reload. That's intentional: the httpOnly cookie will silently restore it.
let _accessToken = null;

export const storageUtils = {
  // ── Access Token (in-memory) ───────────────────────────────────────────────
  getAccessToken: () => _accessToken,
  setAccessToken: (token) => { _accessToken = token; },
  removeAccessToken: () => { _accessToken = null; },

  // ── Refresh Token ──────────────────────────────────────────────────────────
  // The refresh token lives ONLY in the httpOnly cookie set by the server.
  // These are no-ops — they exist only to avoid breaking call sites that
  // previously set/got the refresh token from localStorage.
  getRefreshToken: () => null,       // intentionally always null
  setRefreshToken: (_token) => {},   // intentionally no-op
  removeRefreshToken: () => {},      // intentionally no-op

  // ── User (sessionStorage) ──────────────────────────────────────────────────
  getUser: () => {
    try {
      const raw = sessionStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  setUser: (user) => {
    try {
      sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {
      // sessionStorage may be unavailable in some private browsing modes
    }
  },
  removeUser: () => sessionStorage.removeItem(USER_KEY),

  // ── Bulk helpers ──────────────────────────────────────────────────────────
  setTokens: ({ accessToken }) => {
    // FIX: only the access token is stored client-side.
    // refreshToken is in the httpOnly cookie — ignore it here.
    if (accessToken) _accessToken = accessToken;
  },

  clearTokens: () => {
    _accessToken = null;
    // Refresh token cookie is cleared server-side on logout.
  },

  clearAll: () => {
    _accessToken = null;
    sessionStorage.removeItem(USER_KEY);
    // Note: the httpOnly refresh token cookie is cleared by the backend on logout.
  },
};
