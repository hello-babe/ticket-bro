// frontend/src/components/auth/AuthModal.jsx
//
// System A: Modal-based auth, triggered by ?auth=<type> query param.
//
// Supported ?auth values:
//   login         → LoginForm
//   register      → RegisterForm
//   forgot        → ForgotPasswordForm
//   reset         → ResetPasswordForm  (token read from ?token=)
//   otp           → OTPVerification    (guarded: requires requiresTwoFactor state)
//   verify-notice → VerifyNotice       (shown after register)
//   verify        → VerifyNotice       (alias, also used by backend notice redirects)
//                   NOTE: actual email-token verification happens on /auth/verify-email
//                   (System B page). The modal only shows the "check your inbox" notice.

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { X, Loader2, CheckCircle2, XCircle, MailCheck } from 'lucide-react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

import LoginForm         from './LoginForm';
import RegisterForm      from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import ResetPasswordForm  from './ResetPasswordForm';
import OTPVerification   from './OTPVerification';

import authService from '../../services/authService';
import { selectRequires2FA, selectUser } from '../../store/slices/authSlice';
import authConfig from '../../config/auth.config';
import { useTheme } from '../../context/ThemeContext';

import darkLogo  from '@/assets/images/ticket-bro-logo-dark-mode.png';
import lightLogo from '@/assets/images/ticket-bro-logo-light-mode.png';

// ── Verify-notice panel ───────────────────────────────────────────────────────
// Shown after register OR when ?auth=verify is opened without a token.
// Real email-token verification is handled by /auth/verify-email (System B page).
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
      Didn't get it?{' '}
      <button
        onClick={onResend}
        disabled={loading || sent}
        className="font-semibold text-foreground bg-transparent border-none p-0 cursor-pointer hover:text-[#a3e635] transition-colors duration-150 disabled:opacity-50"
      >
        {sent ? 'Sent!' : loading ? 'Sending…' : 'Resend email'}
      </button>
    </p>
  </div>
);

// ── AuthModal ────────────────────────────────────────────────────────────────
const AuthModal = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate     = useNavigate();
  const authType     = searchParams.get('auth');
  const requires2FA  = useSelector(selectRequires2FA);
  const user         = useSelector(selectUser);
  const { isDark }   = useTheme();

  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent,    setResendSent]    = useState(false);

  // ── Close modal ─────────────────────────────────────────────────────────────
  const closeModal = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('auth');
    next.delete('token');
    setSearchParams(next);
  };

  // ── Body scroll lock ────────────────────────────────────────────────────────
  useEffect(() => {
    if (authType) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [authType]);

  // ── OTP guard: if someone navigates to ?auth=otp without a 2FA flow, redirect ──
  useEffect(() => {
    if (authType === 'otp' && !requires2FA) {
      navigate(authConfig.routes.login, { replace: true });
    }
  }, [authType, requires2FA, navigate]);

  // ── Resend verification email ────────────────────────────────────────────────
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

  // ── Render correct form/panel per ?auth= value ───────────────────────────────
  const renderContent = () => {
    switch (authType) {
      case 'login':
        return <LoginForm />;
      case 'register':
        return <RegisterForm />;
      case 'forgot':
        return <ForgotPasswordForm />;
      case 'reset':
        return <ResetPasswordForm />;
      case 'otp':
        return <OTPVerification />;
      case 'verify-notice':
      case 'verify':
        // Both aliases show the "check your inbox" notice.
        // Actual token-based email verification lives at /auth/verify-email (System B).
        return (
          <VerifyNotice
            onResend={handleResendVerification}
            loading={resendLoading}
            sent={resendSent}
          />
        );
      default:
        return null;
    }
  };

  const content = renderContent();
  if (!content) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="auth-overlay"
        className={[
          'fixed inset-0 z-50',
          'flex items-end sm:items-start justify-center',
          'sm:pt-16 md:pt-24',
          'bg-black/50 backdrop-blur-sm',
          'px-0 sm:px-4',
        ].join(' ')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
      >
        <motion.div
          key="auth-modal"
          initial={{ y: '-100vh', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100vh', opacity: 0 }}
          transition={{ duration: 0.35 }}
          className={[
            'relative bg-card shadow-xl',
            'w-full sm:max-w-[460px]',
            'rounded-t-2xl sm:rounded-xl',
            'max-h-[92dvh] sm:max-h-[90vh]',
            'overflow-y-auto overflow-x-hidden overscroll-contain',
          ].join(' ')}
        >
          {/* Drag handle — mobile only */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden" aria-hidden>
            <div className="w-10 h-1 rounded-full bg-border" />
          </div>

          {/* Close button */}
          <button
            onClick={closeModal}
            aria-label="Close"
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

          {/* Body */}
          <div className="px-4 sm:px-6 py-4 pb-[env(safe-area-inset-bottom,1rem)] sm:pb-6 w-full">
            {content}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;
