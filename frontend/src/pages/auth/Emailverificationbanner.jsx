// frontend/src/components/auth/EmailVerificationBanner.jsx
//
// Show this at the top of the app (in your layout) whenever the user is
// logged in but their email is not yet verified.
// It lets them resend the verification email without leaving the page.

import React, { useState } from "react";
import { MailWarning, X, CheckCircle2, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { selectUser, selectIsAuthenticated } from "@/store/slices/authSlice";
import authService from "@/services/authService";

const EmailVerificationBanner = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  // Only show for authenticated, unverified users
  if (!isAuthenticated || !user || user.isEmailVerified || dismissed) {
    return null;
  }

  const handleResend = async () => {
    setLoading(true);
    setError("");
    try {
      await authService.resendVerification(user.email);
      setSent(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2.5 min-w-0">
          <MailWarning size={15} className="text-amber-500 flex-shrink-0" />
          <p className="text-[0.78rem] text-amber-700 dark:text-amber-400 leading-snug">
            <span className="font-semibold">Verify your email</span> to unlock
            bookings and payments.{" "}
            <span className="text-[0.72rem] opacity-70">
              Sent to {user.email}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Status */}
          {sent ? (
            <span className="flex items-center gap-1.5 text-[0.75rem] text-green-600 dark:text-green-400 font-medium">
              <CheckCircle2 size={13} /> Email sent!
            </span>
          ) : error ? (
            <span className="text-[0.75rem] text-destructive">{error}</span>
          ) : null}

          {/* Resend button */}
          {!sent && (
            <button
              onClick={handleResend}
              disabled={loading}
              className="
                flex items-center gap-1.5 px-3 h-7 rounded-md
                bg-amber-500 text-white text-[0.75rem] font-semibold
                hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-150 cursor-pointer
              "
            >
              {loading ? (
                <>
                  <Loader2 size={11} className="animate-spin" /> Sending…
                </>
              ) : (
                "Resend email"
              )}
            </button>
          )}

          {/* Dismiss */}
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
            className="text-amber-500/60 hover:text-amber-500 transition-colors duration-150"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;
