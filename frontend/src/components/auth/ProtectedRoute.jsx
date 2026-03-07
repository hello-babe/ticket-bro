// frontend/src/components/auth/ProtectedRoute.jsx

import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectIsLoading,
  selectUser,
} from "@/store/slices/authSlice";
import authConfig from "@/config/auth.config";

/**
 * ProtectedRoute
 *
 * Supports two patterns:
 *
 * 1. Layout-route (Outlet pattern):
 *      <Route element={<ProtectedRoute />}>
 *        <Route path="/profile" element={<ProfilePage />} />
 *      </Route>
 *
 * 2. Wrapper pattern (children):
 *      <ProtectedRoute roles={['admin']}>
 *        <AdminPage />
 *      </ProtectedRoute>
 *
 * Props:
 *   allowedRoles  — role check for layout-route usage
 *   roles         — role check for wrapper usage (alias)
 *   requireVerified — if true, redirect unverified email users to verify page
 *   children      — wrapper usage only
 */
const ProtectedRoute = ({
  children,
  roles,
  allowedRoles,
  requireVerified = false,
}) => {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const user = useSelector(selectUser);

  const requiredRoles = allowedRoles ?? roles ?? null;

  // ── Loading state ───────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-6 h-6 rounded-full border-2 border-transparent border-t-[#a3e635]"
            style={{ animation: "spin 0.7s linear infinite" }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p className="text-[0.8rem] text-muted-foreground">Loading…</p>
        </div>
      </div>
    );
  }

  // ── Not authenticated ───────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <Navigate
        to={authConfig.routes.login}
        state={{ from: location }}
        replace
      />
    );
  }

  // FIX: Email verification gate.
  // If requireVerified is set and the user hasn't verified their email,
  // send them to the verify-notice modal instead of the protected page.
  if (requireVerified && user && !user.isEmailVerified) {
    return (
      <Navigate
        to={authConfig.routes.verifyEmailNotice}
        state={{ from: location }}
        replace
      />
    );
  }

  // ── Role check ──────────────────────────────────────────────────────────────
  if (requiredRoles && user && !requiredRoles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return children ?? <Outlet />;
};

export default ProtectedRoute;
