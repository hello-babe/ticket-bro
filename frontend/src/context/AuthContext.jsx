// frontend/src/context/AuthContext.jsx

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

// ── Context (read-only access) ────────────────────────────────────────────────
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);

  // ── Silent re-authentication on page reload ─────────────────────────────────
  // FIX: In the new in-memory token model, the access token is gone after a reload.
  //
  // Old (broken) check: `if (storageUtils.getAccessToken() && !user)` 
  //   → getAccessToken() is ALWAYS null after reload, so this never triggered.
  //
  // New check: if sessionStorage has a persisted user object AND we're not yet
  //   authenticated, call fetchMe(). The /auth/me request will 401, the axios
  //   interceptor fires POST /auth/refresh-token (httpOnly cookie auto-sent),
  //   gets a new access token, and retries /auth/me — all transparently.
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

// ── Main hook (components that need actions too) ──────────────────────────────
export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectAuthError);
  const requires2FA = useSelector(selectRequires2FA);
  const twoFactorEmail = useSelector(select2FAEmail);

  const register = async (data) => {
    const result = await dispatch(registerUser(data));
    if (!result.error) {
      navigate(authConfig.routes.verifyEmailNotice);
    }
    return result;
  };

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

  const logout = async () => {
    await dispatch(logoutUser());
    navigate(authConfig.routes.login);
  };

  const verify2FA = async (email, otp) => {
    const result = await dispatch(verifyTwoFactor({ email, otp }));
    if (!result.error) {
      navigate(authConfig.routes.home);
    }
    return result;
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    requires2FA,
    twoFactorEmail,
    register,
    login,
    logout,
    verify2FA,
    refreshProfile: () => dispatch(fetchMe()),
    clearError: () => dispatch(clearError()),
    clearTwoFactor: () => dispatch(clearTwoFactor()),
  };
};

export default useAuth;
