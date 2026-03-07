// frontend/src/services/authService.js

import api from "../api/api";
import authConfig from "../config/auth.config";
import { storageUtils } from "../utils/storageUtils"; // FIX: static import — no dynamic await import()

const authService = {
  // ── Core auth ─────────────────────────────────────────────────────────────
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),

  // FIX: Must be async to use await. Also use static import (above) instead
  // of dynamic await import() which is unnecessary and was causing a syntax error.
  logout: async () => {
    const rt = storageUtils.getRefreshToken();
    return api.post("/auth/logout", { refreshToken: rt });
  },

  logoutAll: () => api.post("/auth/logout-all"),
  refreshToken: (token) =>
    api.post("/auth/refresh-token", { refreshToken: token }),
  getMe: () => api.get("/auth/me"),

  // ── Email verification ────────────────────────────────────────────────────
  verifyEmail: (token) => api.post("/auth/verify-email", { token }),
  resendVerification: (email) =>
    api.post("/auth/resend-verification", { email }),

  // ── Password ──────────────────────────────────────────────────────────────
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (data) => api.post("/auth/reset-password", data),
  changePassword: (data) => api.post("/auth/change-password", data),

  // ── Sessions ──────────────────────────────────────────────────────────────
  getActiveSessions: () => api.get("/auth/sessions"),

  // ── 2FA ───────────────────────────────────────────────────────────────────
  setup2FA: () => api.post("/auth/2fa/setup"),
  enable2FA: (token) => api.post("/auth/2fa/enable", { token }),
  disable2FA: (password) => api.post("/auth/2fa/disable", { password }),
  verifyTwoFactor: (email, otp) => api.post("/auth/2fa/verify", { email, otp }),

  // ── OAuth — redirect-based, not API calls ─────────────────────────────────
  googleOAuth: () => {
    window.location.href = `${authConfig.apiBaseUrl}/auth/oauth/google`;
  },
  facebookOAuth: () => {
    window.location.href = `${authConfig.apiBaseUrl}/auth/oauth/facebook`;
  },
};

export default authService;
