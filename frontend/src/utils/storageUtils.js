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
//   USER OBJECT   → localStorage (survives reload AND tab switches)
//                   On reload/new tab: AuthContext detects localStorage user, calls
//                   fetchMe() which fires /auth/me → 401 → axios interceptor
//                   → POST /auth/refresh-token (cookie auto-sent) → new access
//                   token stored in memory → /auth/me retried → success.
//
// Security note: Only the non-sensitive user object is in localStorage.
// The access token never touches localStorage or sessionStorage.
// The refresh token is httpOnly — completely invisible to JavaScript.

import authConfig from '../config/auth.config';

const { user: USER_KEY } = authConfig.storage;

// ── In-memory access token ─────────────────────────────────────────────────────
// Stored as a module-level variable — survives React re-renders but is wiped
// on page reload. That's intentional: the httpOnly cookie will silently restore it.
let _accessToken = null;

export const storageUtils = {
  // ── Access Token (in-memory) ───────────────────────────────────────────────
  getAccessToken: () => _accessToken,
  setAccessToken: (token) => {
    _accessToken = token;
  },
  removeAccessToken: () => {
    _accessToken = null;
  },

  // ── Refresh Token ──────────────────────────────────────────────────────────
  // The refresh token lives ONLY in the httpOnly cookie set by the server.
  // These are no-ops — they exist only to avoid breaking call sites that
  // previously set/got the refresh token from localStorage.
  getRefreshToken: () => null,  // intentionally always null
  setRefreshToken: (_token) => {},  // intentionally no-op
  removeRefreshToken: () => {},     // intentionally no-op

  // ── User (localStorage) ────────────────────────────────────────────────────
  // Stored in localStorage so auth state survives page reload and persists
  // across tabs. On restore, AuthContext calls fetchMe() to re-validate the
  // session and get a fresh access token via the httpOnly cookie.
  getUser: () => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  setUser: (user) => {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {
      // localStorage may be unavailable in some private browsing modes
    }
  },
  removeUser: () => {
    try {
      localStorage.removeItem(USER_KEY);
    } catch {
      // ignore
    }
  },

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
    try { localStorage.removeItem(USER_KEY); } catch { /* ignore */ }
    // Note: the httpOnly refresh token cookie is cleared by the backend on logout.
  },
};
