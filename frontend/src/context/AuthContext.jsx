// frontend/src/context/AuthContext.jsx

import React, { createContext, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
} from "../store/slices/authSlice";
import { storageUtils } from "../utils/storageUtils";
import authConfig from "../config/auth.config";

// ── Context (consumed by components that only need read access) ───────────────
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);

  // FIX 1: On mount, if a token exists in storage but Redux has no user yet
  // (e.g. page refresh), rehydrate by calling /me.
  // FIX 2: dispatch added to dependency array (eslint-plugin-react-hooks).
  useEffect(() => {
    const token = storageUtils.getAccessToken();
    if (token && !user) {
      dispatch(fetchMe());
    }
  }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx)
    throw new Error("useAuthContext must be used inside <AuthProvider>");
  return ctx;
};

// ── Main hook (used by components that need actions too) ──────────────────────
export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectAuthError);
  const requires2FA = useSelector(selectRequires2FA);
  const twoFactorEmail = useSelector(select2FAEmail);

  // ── register ────────────────────────────────────────────────────────────────
  // FIX: After register the user's email is NOT yet verified.
  // Navigate to a "check your email" page, NOT straight to /profile.
  // Backend still issues tokens here so the user can later resend verification,
  // but requireEmailVerified middleware blocks sensitive routes until verified.
  const register = async (data) => {
    const result = await dispatch(registerUser(data));
    if (!result.error) {
      navigate(authConfig.routes.verifyEmailNotice);
    }
    return result;
  };

  // ── login ───────────────────────────────────────────────────────────────────
  // FIX: Check requiresTwoFactor on the payload, NOT on result.error.
  // When 2FA is required, there is no error — just an intermediate state.
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
  // FIX: storageUtils.clearAll() is now handled inside the logoutUser thunk's
  // finally block, so it always runs even if the API call fails.
  const logout = async () => {
    await dispatch(logoutUser());
    navigate(authConfig.routes.login);
  };

  // ── verify 2FA ──────────────────────────────────────────────────────────────
  // FIX: Tokens are issued by the server only after OTP is verified.
  // The thunk stores them — nothing extra needed here.
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

// Default export for files using: import useAuth from '...'
export default useAuth;
