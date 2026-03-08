// frontend/src/components/auth/OTPVerification.jsx
// Used by: AuthModal (?auth=otp) — System A

import React, { useRef, useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  verifyTwoFactor,
  selectIsLoading,
  selectAuthError,
  select2FAEmail,
  selectRequires2FA,
  clearError,
} from '@/store/slices/authSlice';
import authConfig from '@/config/auth.config';
import authService from '@/services/authService';
import toast from 'react-hot-toast';

const Spinner = () => (
  <>
    <span className="w-4 h-4 rounded-full border-2 border-foreground/20 border-t-foreground inline-block"
      style={{ animation: 'otpSpin .65s linear infinite' }} />
    <style>{`@keyframes otpSpin { to { transform: rotate(360deg); } }`}</style>
  </>
);

const OTPVerification = () => {
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isLoading      = useSelector(selectIsLoading);
  const error          = useSelector(selectAuthError);
  const twoFactorEmail = useSelector(select2FAEmail);
  const requires2FA    = useSelector(selectRequires2FA);

  const [otp,       setOtp]       = useState(Array(6).fill(''));
  const [submitted, setSubmitted] = useState(false);
  const [resending, setResending] = useState(false);
  const refs = useRef([]);

  // Auto-focus first input on mount
  useEffect(() => { refs.current[0]?.focus(); }, []);

  // Clear stale error when user types
  useEffect(() => {
    if (otp.some(d => d !== '') && error) dispatch(clearError());
  }, [otp, error, dispatch]);

  // Guard: if no 2FA state in Redux, send back to login modal
  useEffect(() => {
    if (!twoFactorEmail || !requires2FA) {
      navigate(authConfig.routes.login, { replace: true });
    }
  }, [twoFactorEmail, requires2FA, navigate]);

  const submit = async (code) => {
    if (submitted) return;
    setSubmitted(true);
    try {
      const result = await dispatch(verifyTwoFactor({ email: twoFactorEmail, otp: code }));
      if (!result.error) {
        // Close modal — user is now authenticated
        const next = new URLSearchParams(searchParams);
        next.delete('auth');
        setSearchParams(next);
      }
    } finally {
      setSubmitted(false);
    }
  };

  const change = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
    if (next.every(d => d !== '')) submit(next.join(''));
  };

  const keydown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const paste = (e) => {
    e.preventDefault();
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
    const next = Array(6).fill('');
    digits.forEach((c, i) => (next[i] = c));
    setOtp(next);
    if (digits.length === 6) submit(digits.join(''));
    else refs.current[digits.length]?.focus();
  };

  const handleResend = async () => {
    if (resending) return;
    setResending(true);
    try {
      await authService.resendOTP?.(twoFactorEmail);
      toast.success('OTP resent successfully');
      setOtp(Array(6).fill(''));
      refs.current[0]?.focus();
    } catch {
      toast.error('Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full text-center">
      {/* Icon */}
      <div className="rounded-xl bg-muted border border-border flex items-center justify-center mx-auto mb-5"
        style={{ width: 52, height: 52 }}>
        <ShieldCheck size={22} className="text-foreground" />
      </div>

      <h2 className="font-heading font-extrabold tracking-tight text-foreground leading-tight mb-1.5"
        style={{ fontSize: 'clamp(1.4rem, 2vw, 1.65rem)' }}>
        Two-factor authentication
      </h2>
      <p className="text-[0.82rem] text-muted-foreground mb-1">Code sent to</p>
      <p className="text-[0.88rem] font-semibold font-heading text-foreground mb-7">{twoFactorEmail}</p>

      {/* OTP inputs */}
      <div className="flex items-center justify-center gap-2.5 mb-3" onPaste={paste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={el => (refs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => change(i, e.target.value)}
            onKeyDown={e => keydown(i, e)}
            aria-label={`OTP digit ${i + 1}`}
            className={[
              'w-11 text-center text-[1.1rem] font-semibold font-heading rounded-lg border bg-card text-foreground outline-none transition-colors duration-150 caret-[#a3e635]',
              error
                ? 'border-destructive'
                : digit
                  ? 'border-[#a3e635]/60 bg-[#a3e635]/[0.04]'
                  : 'border-input hover:border-ring/60 focus:border-ring',
            ].join(' ')}
            style={{ height: 52 }}
          />
        ))}
      </div>

      {error && <p className="text-[0.75rem] text-destructive mb-3 leading-none">{error}</p>}
      {(isLoading || submitted) && (
        <div className="flex justify-center mb-4"><Spinner /></div>
      )}

      <button
        type="button"
        disabled={resending}
        onClick={handleResend}
        className="text-[0.78rem] text-muted-foreground hover:text-foreground transition-colors duration-150 underline mb-4"
      >
        {resending ? 'Resending...' : 'Resend code'}
      </button>

      <p className="text-[0.7rem] text-muted-foreground">
        Code expires in <span className="font-medium text-foreground">10 minutes</span>
      </p>
    </div>
  );
};

export default OTPVerification;
