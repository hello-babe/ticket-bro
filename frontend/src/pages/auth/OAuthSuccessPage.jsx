// frontend/src/pages/auth/OAuthSuccessPage.jsx
// Route: /auth/oauth-success?token=<accessToken>
//
// Backend redirects here after Google/Facebook OAuth completes:
//   passport → generateTokenPair → redirect to FRONTEND_URL/auth/oauth-success?token=...
//
// This page:
//   1. Reads token from URL
//   2. Calls /auth/me to get full user profile
//   3. Hydrates Redux via setAuthFromOAuth
//   4. Redirects to home (or the page they came from)

import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Loader2, XCircle } from "lucide-react";
import { setAuthFromOAuth } from "@/store/slices/authSlice";
import { storageUtils } from "@/utils/storageUtils";
import authService from "@/services/authService";
import { ROUTES } from "@/app/AppRoutes";
import AuthLayout from "@/components/layout/AuthLayout";

const OAuthSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setError("OAuth login failed — no token received. Please try again.");
      return;
    }

    let cancelled = false;

    const hydrate = async () => {
      try {
        // 1. Store access token so the /me request is authenticated
        storageUtils.setAccessToken(token);

        // 2. Fetch full user profile
        const res = await authService.getMe();
        const user = res.data.data;

        if (cancelled) return;

        // 3. Hydrate Redux — refresh token is in httpOnly cookie from backend
        dispatch(
          setAuthFromOAuth({
            user,
            accessToken: token,
            refreshToken: storageUtils.getRefreshToken() || "",
          }),
        );

        // 4. Redirect home
        navigate(ROUTES.HOME, { replace: true });
      } catch (err) {
        if (!cancelled) {
          storageUtils.clearAll();
          setError(
            err.response?.data?.message ||
              "Failed to complete sign in. Please try again.",
          );
        }
      }
    };

    hydrate();
    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line

  return (
    <AuthLayout>
      <div style={{ textAlign: "center" }}>
        {!error ? (
          <>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: "rgba(163,230,53,0.1)",
                border: "1px solid rgba(163,230,53,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <Loader2
                size={28}
                style={{
                  color: "#a3e635",
                  animation: "spin 1s linear infinite",
                }}
              />
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 800,
                marginBottom: 8,
                letterSpacing: "-0.5px",
                color: "var(--foreground,#111)",
              }}
            >
              Signing you in…
            </h1>
            <p
              style={{
                fontSize: 13.5,
                color: "var(--muted-foreground,#6b7280)",
              }}
            >
              Just a second while we set up your session.
            </p>
          </>
        ) : (
          <>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <XCircle size={28} style={{ color: "#ef4444" }} />
            </div>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 800,
                marginBottom: 8,
                letterSpacing: "-0.5px",
                color: "var(--foreground,#111)",
              }}
            >
              Sign in failed
            </h1>
            <p
              style={{
                fontSize: 13.5,
                color: "var(--muted-foreground,#6b7280)",
                marginBottom: 28,
              }}
            >
              {error}
            </p>
            <button
              onClick={() => navigate(ROUTES.AUTH.LOGIN)}
              style={{
                width: "100%",
                height: 46,
                borderRadius: 12,
                background: "#a3e635",
                color: "#000",
                border: "none",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Back to sign in
            </button>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default OAuthSuccessPage;
