// frontend/src/services/authService.js

import api from '../api/api';
import authConfig from '../config/auth.config';

const authService = {
  // ── Core auth ─────────────────────────────────────────────────────────────
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),

  // FIX: Send empty body — the httpOnly refreshToken cookie is sent automatically
  // by the browser (withCredentials:true on the api instance).
  // Previously this read the refresh token from localStorage and put it in the
  // body, which defeated the httpOnly cookie security model.
  logout: () => api.post('/auth/logout', {}),

  logoutAll: () => api.post('/auth/logout-all'),

  // FIX: empty body — cookie is sent automatically
  refreshToken: () => api.post('/auth/refresh-token', {}),

  getMe: () => api.get('/auth/me'),

  // ── Email verification ────────────────────────────────────────────────────
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  resendVerification: (email) => api.post('/auth/resend-verification', { email }),

  // ── Password ──────────────────────────────────────────────────────────────
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  changePassword: (data) => api.post('/auth/change-password', data),

  // ── Sessions ──────────────────────────────────────────────────────────────
  getActiveSessions: () => api.get('/auth/sessions'),

  // ── 2FA ───────────────────────────────────────────────────────────────────
  setup2FA: () => api.post('/auth/2fa/setup'),
  enable2FA: (token) => api.post('/auth/2fa/enable', { token }),
  disable2FA: (password) => api.post('/auth/2fa/disable', { password }),
  verifyTwoFactor: (email, otp) => api.post('/auth/2fa/verify', { email, otp }),

  // ── OAuth — redirect-based (not API calls) ────────────────────────────────
  googleOAuth: () => {
    window.location.href = `${authConfig.apiBaseUrl}/auth/oauth/google`;
  },
  facebookOAuth: () => {
    window.location.href = `${authConfig.apiBaseUrl}/auth/oauth/facebook`;
  },
};

export default authService;
