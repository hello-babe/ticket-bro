// frontend/src/context/AuthContext.jsx
//
// Dual auth system:
//   Modal system  — ?auth=login  → opens AuthModal over current page
//   Page system   — /auth/login  → full-page AuthLayout routes
//
// Both systems use the same Redux store (authSlice) and this hook.

import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  registerUser,
  loginUser,
  logoutUser,
  fetchMe,
  verifyTwoFactor,
  clearError,
  clearTwoFactor,
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectAuthError,
  selectRequires2FA,
  select2FAEmail,
} from '../store/slices/authSlice';
import { storageUtils } from '../utils/storageUtils';
import authConfig from '../config/auth.config';
import authService from '../services/authService';

// ── Context (read-only — for components that only need state, no router) ──────
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch        = useDispatch();
  const user            = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading       = useSelector(selectIsLoading);

  // Silent re-auth on page reload:
  // Access token is in-memory so it's gone after a reload.
  // sessionStorage still has the user object → call fetchMe() which will 401,
  // the axios interceptor fires POST /auth/refresh-token (httpOnly cookie sent
  // automatically), gets a new access token, retries GET /auth/me — transparent.
  useEffect(() => {
    const persistedUser = storageUtils.getUser();
    if (persistedUser && !isAuthenticated) {
      dispatch(fetchMe());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside <AuthProvider>');
  return ctx;
};

// ── Main hook — used by both modal forms and page components ──────────────────
// Requires a Router context (calls useNavigate internally).
export const useAuth = () => {
  const dispatch       = useDispatch();
  const navigate       = useNavigate();
  const user           = useSelector(selectUser);
  const isAuthenticated= useSelector(selectIsAuthenticated);
  const isLoading      = useSelector(selectIsLoading);
  const error          = useSelector(selectAuthError);
  const requires2FA    = useSelector(selectRequires2FA);
  const twoFactorEmail = useSelector(select2FAEmail);

  // ── register ────────────────────────────────────────────────────────────────
  // After register, navigate to the verify-notice screen.
  // Modal system: ?auth=verify-notice  |  Page system: caller handles navigation
  const register = async (data) => {
    const result = await dispatch(registerUser(data));
    if (!result.error) {
      // Navigate to verify-notice in the modal system.
      // Page system (RegisterPage) overrides navigation after calling dispatch directly.
      navigate(authConfig.routes.verifyEmailNotice);
    }
    return result;
  };

  // ── login ───────────────────────────────────────────────────────────────────
  // After login, navigate to OTP (if 2FA) or home.
  // Modal system: ?auth=otp  |  Page system: caller handles navigation
  const login = async (data) => {
    const result = await dispatch(loginUser(data));
    if (!result.error) {
      if (result.payload?.requiresTwoFactor) {
        navigate(authConfig.routes.otp);
      } else {
        navigate(authConfig.routes.home);
      }
    }
    return result;
  };

  // ── logout ──────────────────────────────────────────────────────────────────
  const logout = async () => {
    await dispatch(logoutUser());
    navigate(authConfig.routes.login);
  };

  // ── verify2FA ───────────────────────────────────────────────────────────────
  // Signature: verify2FA(email, otp) — used by OTPVerification modal component
  const verify2FA = async (email, otp) => {
    const result = await dispatch(verifyTwoFactor({ email, otp }));
    if (!result.error) {
      navigate(authConfig.routes.home);
    }
    return result;
  };

  // ── verifyOTP ───────────────────────────────────────────────────────────────
  // Signature: verifyOTP({ email, otp }) — used by OTPVerificationPage (/auth/verify-otp)
  // Just an object-destructure alias for verify2FA.
  const verifyOTP = async ({ email, otp }) => verify2FA(email, otp);

  // ── resend2FA ───────────────────────────────────────────────────────────────
  // Resend OTP to the given email. Used by OTPVerification modal component.
  const resend2FA = async (email) => {
    // authService doesn't have a dedicated resend-otp endpoint — calling login
    // with an unknown password won't work. We use the resendVerification endpoint
    // as a proxy, or expose a dedicated one. For now we just call the 2fa resend
    // if the backend supports it, otherwise it's a no-op that shows toast.
    return authService.resendOTP?.(email) ?? Promise.resolve();
  };

  // ── hasRole ─────────────────────────────────────────────────────────────────
  // hasRole('admin', 'super_admin') — checks if current user has any of the given roles
  const hasRole = (...roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    requires2FA,
    twoFactorEmail,

    // Actions
    register,
    login,
    logout,
    verify2FA,
    verifyOTP,
    resend2FA,
    hasRole,
    refreshProfile:  () => dispatch(fetchMe()),
    clearError:      () => dispatch(clearError()),
    clearTwoFactor:  () => dispatch(clearTwoFactor()),
  };
};

// Default export is the hook (for `import useAuth from '@/context/AuthContext'`)
export default useAuth;
