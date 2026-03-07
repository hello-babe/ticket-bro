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
import Container from "@/components/layout/Container";

// ── Verify-notice component ─────────────────────────
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

// ── AuthModal ───────────────────────────────────────
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

  // ── Close modal ─────────────────────────
  const closeModal = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("auth");
    next.delete("token");
    setSearchParams(next);
    setVerifyStatus("");
    setVerifyMessage("");
  };

  // ── Scroll lock ─────────────────────────
  useEffect(() => {
    document.body.style.overflow = authType ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [authType]);

  // ── Email verification ─────────────────────────
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
    return () => {
      cancelled = true;
    };
  }, [authType]);

  // ── Guard OTP page ─────────────────────────
  useEffect(() => {
    if (authType === "otp" && !requires2FA) {
      navigate(authConfig.routes.login, { replace: true });
    }
  }, [authType, requires2FA, navigate]);

  // ── Resend verification ─────────────────────
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

  const renderContent = () => {
    switch (authType) {
      case "login":
        return <LoginForm />;
      case "register":
        return <RegisterForm />;
      case "forgot":
        return <ForgotPasswordForm />;
      case "reset":
        return <ResetPasswordForm />;
      case "otp":
        return <OTPVerification />;
      case "verify-notice":
        return (
          <VerifyNotice
            onResend={handleResendVerification}
            loading={resendLoading}
            sent={resendSent}
          />
        );
      case "verify":
        return renderVerifyState();
      default:
        return null;
    }
  };

  const renderVerifyState = () => {
    if (verifyStatus === "loading") {
      return (
        <div className="text-center space-y-2 py-4">
          <Loader2
            className="animate-spin mx-auto text-muted-foreground"
            size={24}
          />
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

  return (
    <div>
      <Container>
        <AnimatePresence>
          {authType && (
            <motion.div
              key="auth-overlay"
              className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/50 backdrop-blur-xs"
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
                initial={{ y: "-100vh", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100vh", opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="
                  relative w-full max-w-[460px] mx-2
                  rounded-xl bg-card shadow-md max-h-[90vh] overflow-y-auto overflow-x-hidden
                "
              >
                {/* Close button */}
                <button
                  onClick={closeModal}
                  aria-label="Close"
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition"
                >
                  <X size={16} />
                </button>

                {/* Header */}
                <div className="px-4 sm:px-6 pt-4 pb-2 text-center border-b border-border flex flex-col items-center space-y-1">
                  <img
                    src={isDark ? darkLogo : lightLogo}
                    alt="Ticket Bro"
                    className="h-8"
                  />
                  <h1 className="text-xl font-bold font-brand tracking-tight">
                    Ticket Bro
                  </h1>
                </div>

                {/* Body */}
                <div className="px-4 sm:px-6 py-4 w-full">
                  {renderContent()}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
};

export default AuthModal;
