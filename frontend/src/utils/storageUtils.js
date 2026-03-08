// frontend/src/utils/storageUtils.js
//
// Centralised token + user storage.
// All reads/writes go through here — never access localStorage directly.

import authConfig from "../config/auth.config";

const {
  accessToken: AT_KEY,
  refreshToken: RT_KEY,
  user: USER_KEY,
} = authConfig.storage;

export const storageUtils = {
  // ── Access Token ──────────────────────────────────────────────────────────
  getAccessToken: () => localStorage.getItem(AT_KEY),
  setAccessToken: (token) => localStorage.setItem(AT_KEY, token),
  removeAccessToken: () => localStorage.removeItem(AT_KEY),

  // ── Refresh Token ─────────────────────────────────────────────────────────
  // FIX: Refresh token is sent as an httpOnly cookie by the backend.
  // We keep a copy in localStorage only for the interceptor to pass it in the
  // request body (backend reads req.body.refreshToken || req.cookies.refreshToken).
  // Do NOT rely solely on the cookie — it's path-restricted to /refresh-token.
  getRefreshToken: () => localStorage.getItem(RT_KEY),
  setRefreshToken: (token) => localStorage.setItem(RT_KEY, token),
  removeRefreshToken: () => localStorage.removeItem(RT_KEY),

  // ── User ──────────────────────────────────────────────────────────────────
  getUser: () => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  removeUser: () => localStorage.removeItem(USER_KEY),

  // ── Bulk helpers ──────────────────────────────────────────────────────────
  setTokens: ({ accessToken, refreshToken }) => {
    if (accessToken) localStorage.setItem(AT_KEY, accessToken);
    if (refreshToken) localStorage.setItem(RT_KEY, refreshToken);
  },

  // FIX: clearAll previously wasn't called on logout — access token stayed
  // alive in localStorage even after server-side session was revoked.
  clearTokens: () => {
    localStorage.removeItem(AT_KEY);
    localStorage.removeItem(RT_KEY);
  },

  clearAll: () => {
    localStorage.removeItem(AT_KEY);
    localStorage.removeItem(RT_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
