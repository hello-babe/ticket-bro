// frontend/src/pages/auth/AuthModal.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { X, Loader2, CheckCircle2, XCircle, MailCheck } from "lucide-react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ResetPasswordForm from "./ResetPasswordForm";
import OTPVerification from "./OTPVerification";

import authService from "../../services/authService";
import { selectRequires2FA, selectUser } from "../../store/slices/authSlice";
import authConfig from "../../config/auth.config";
import { useTheme } from "../../context/ThemeContext";

import darkLogo from "@/assets/images/ticket-bro-logo-dark-mode.png";
import lightLogo from "@/assets/images/ticket-bro-logo-light-mode.png";

// ── Verify-notice component ──────────────────────────────────────────────────
const VerifyNotice = ({ onResend, loading, sent }) => (
  <div className="w-full text-center py-2">
    <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center mx-auto mb-5">
      <MailCheck size={20} className="text-foreground" />
    </div>
    <h2 className="font-heading font-extrabold tracking-tight text-foreground text-xl mb-2">
      Almost there!
    </h2>
    <p className="text-[0.82rem] text-muted-foreground mb-1">
      We've sent a verification link to your email.
    </p>
    <p className="text-[0.82rem] text-muted-foreground mb-6">
      Click the link to activate your account.
    </p>
    <p className="text-[0.78rem] text-muted-foreground">
      Didn't get it?{" "}
      <button
        onClick={onResend}
        disabled={loading || sent}
        className="font-semibold text-foreground bg-transparent border-none p-0 cursor-pointer hover:text-[#a3e635] transition-colors duration-150 disabled:opacity-50"
      >
        {sent ? "Sent!" : loading ? "Sending…" : "Resend email"}
      </button>
    </p>
  </div>
);

// ── AuthModal ────────────────────────────────────────────────────────────────
const AuthModal = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const authType = searchParams.get("auth");
  const requires2FA = useSelector(selectRequires2FA);
  const user = useSelector(selectUser);
  const { isDark } = useTheme();

  const [verifyStatus, setVerifyStatus] = useState("");
  const [verifyMessage, setVerifyMessage] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  // ── Close modal ────────────────────────────────────────────────────────────
  const closeModal = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("auth");
    next.delete("token");
    setSearchParams(next);
    setVerifyStatus("");
    setVerifyMessage("");
  };

  // ── Scroll lock ────────────────────────────────────────────────────────────
  // Also prevents iOS Safari rubber-band scroll bleeding through the modal
  useEffect(() => {
    if (authType) {
      document.body.style.overflow = "hidden";
      // iOS Safari needs this too
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [authType]);

  // ── Email verification ─────────────────────────────────────────────────────
  useEffect(() => {
    if (authType !== "verify") return;

    const token = searchParams.get("token");
    if (!token) {
      setVerifyStatus("error");
      setVerifyMessage("Invalid or missing verification token.");
      return;
    }

    let cancelled = false;
    const run = async () => {
      setVerifyStatus("loading");
      try {
        const res = await authService.verifyEmail(token);
        if (!cancelled) {
          setVerifyStatus("success");
          setVerifyMessage(res.data?.message || "Email verified successfully.");
        }
      } catch (err) {
        if (!cancelled) {
          setVerifyStatus("error");
          setVerifyMessage(
            err.response?.data?.message || "Verification failed.",
          );
        }
      }
    };
    run();
    return () => { cancelled = true; };
  }, [authType]);

  // ── Guard OTP page ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (authType === "otp" && !requires2FA) {
      navigate(authConfig.routes.login, { replace: true });
    }
  }, [authType, requires2FA, navigate]);

  // ── Resend verification ────────────────────────────────────────────────────
  const handleResendVerification = async () => {
    if (!user?.email) return;
    setResendLoading(true);
    try {
      await authService.resendVerification(user.email);
      setResendSent(true);
      setTimeout(() => setResendSent(false), 5000);
    } finally {
      setResendLoading(false);
    }
  };

  if (!authType) return null;

  // ── Verify state renderer ──────────────────────────────────────────────────
  const renderVerifyState = () => {
    if (verifyStatus === "loading") {
      return (
        <div className="text-center space-y-2 py-4">
          <Loader2 className="animate-spin mx-auto text-muted-foreground" size={24} />
          <p className="text-xs text-muted-foreground">Verifying your email…</p>
        </div>
      );
    }

    if (verifyStatus === "success") {
      return (
        <div className="text-center space-y-2 py-4">
          <CheckCircle2 size={32} className="mx-auto text-green-500" />
          <h2 className="text-base font-semibold">Email verified!</h2>
          <p className="text-xs text-muted-foreground">{verifyMessage}</p>
          <button
            onClick={() => navigate(authConfig.routes.login)}
            className="mt-3 w-full rounded-lg bg-[#a3e635] text-black py-2 text-sm font-semibold hover:brightness-110 transition"
          >
            Continue to sign in
          </button>
        </div>
      );
    }

    if (verifyStatus === "error") {
      return (
        <div className="text-center space-y-2 py-4">
          <XCircle size={32} className="mx-auto text-destructive" />
          <h2 className="text-base font-semibold">Verification Failed</h2>
          <p className="text-xs text-muted-foreground">{verifyMessage}</p>
          <Link
            to="?auth=forgot"
            className="inline-block mt-3 text-[0.8rem] text-foreground underline underline-offset-2 hover:text-[#a3e635] transition"
          >
            Request a new verification link →
          </Link>
        </div>
      );
    }

    return null;
  };

  const renderContent = () => {
    switch (authType) {
      case "login":         return <LoginForm />;
      case "register":      return <RegisterForm />;
      case "forgot":        return <ForgotPasswordForm />;
      case "reset":         return <ResetPasswordForm />;
      case "otp":           return <OTPVerification />;
      case "verify-notice": return (
        <VerifyNotice
          onResend={handleResendVerification}
          loading={resendLoading}
          sent={resendSent}
        />
      );
      case "verify":        return renderVerifyState();
      default:              return null;
    }
  };

  return (
    // Portal-style full-screen overlay — no Container wrapper needed here,
    // that was clipping the overlay on narrow viewports.
    <AnimatePresence>
      {authType && (
        <motion.div
          key="auth-overlay"
          className={[
            // Full viewport cover
            "fixed inset-0 z-50",
            "flex items-end sm:items-start", // ← bottom-sheet on mobile, top-centered on sm+
            "justify-center",
            "sm:pt-16 md:pt-24", // less top offset on small tablets
            "bg-black/50 backdrop-blur-sm",
            "px-0 sm:px-4", // no side gap on mobile (sheet goes edge-to-edge)
          ].join(" ")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <motion.div
            key="auth-modal"
            // Mobile: slide up from bottom. sm+: drop down from top.
            initial={{ y: "-100vh", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100vh", opacity: 0 }}
            transition={{ duration: 0.35 }}
            // Override animation direction on sm+
            style={{}}
            // transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
            className={[
              "relative bg-card shadow-xl",
              "w-full sm:max-w-[460px]",
              // Mobile: full-width bottom sheet with rounded top corners only
              "rounded-t-2xl sm:rounded-xl",
              // Height: on mobile allow up to 92dvh so content is reachable above the keyboard
              "max-h-[92dvh] sm:max-h-[90vh]",
              "overflow-y-auto overflow-x-hidden",
              // Smooth momentum scroll on iOS
              "overscroll-contain",
            ].join(" ")}
          >
            {/* Drag handle — visible on mobile only */}
            <div
              className="flex justify-center pt-3 pb-1 sm:hidden"
              aria-hidden
            >
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>

            {/* Close button */}
            <button
              onClick={closeModal}
              aria-label="Close"
              // Larger tap target on mobile (44×44 px)
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition"
            >
              <X size={15} />
            </button>

            {/* Header */}
            <div className="px-4 sm:px-6 pt-2 sm:pt-4 pb-3 text-center border-b border-border flex flex-col items-center space-y-1">
              <img
                src={isDark ? darkLogo : lightLogo}
                alt="Ticket Bro"
                className="h-7 sm:h-8"
              />
              <h1 className="text-lg sm:text-xl font-bold font-brand tracking-tight">
                Ticket Bro
              </h1>
            </div>

            {/* Body — extra bottom padding so content clears the iOS home bar */}
            <div className="px-4 sm:px-6 py-4 pb-[env(safe-area-inset-bottom,1rem)] sm:pb-6 w-full">
              {renderContent()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;