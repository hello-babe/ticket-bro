// frontend/src/components/auth/LoginForm.jsx
// Used by: AuthModal (?auth=login) — System A

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  selectIsLoading,
  selectAuthError,
  clearError,
} from "@/store/slices/authSlice";
import authConfig from "@/config/auth.config";
import SocialLogin from "./SocialLogin";
import { loginSchema } from "@/utils/validators";
import {
  InputField,
  Button,
  Divider,
  UnverifiedBanner,
} from "@/components/shared";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectAuthError);

  const [showPw, setShowPw] = useState(false);
  const [unverified, setUnverified] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // Clear error when user types
  useEffect(() => {
    const sub = watch(() => {
      if (unverified) setUnverified(false);
      if (error) dispatch(clearError());
    });
    return () => sub.unsubscribe();
  }, [watch, unverified, error, dispatch]);

  const onSubmit = async (data) => {
    setUnverified(false);
    dispatch(clearError());

    const result = await dispatch(loginUser(data));

    if (!result.error) {
      if (result.payload?.requiresTwoFactor) {
        // Switch modal to OTP panel
        const next = new URLSearchParams(searchParams);
        next.set("auth", "otp");
        setSearchParams(next);
      } else {
        // Close modal and stay on current page (user is now logged in)
        const next = new URLSearchParams(searchParams);
        next.delete("auth");
        next.delete("token");
        setSearchParams(next);
      }
    } else {
      const msg = (result.payload || "").toLowerCase();
      if (msg.includes("verify") || msg.includes("verification")) {
        setUnverified(true);
      }
    }
  };

  return (
    <div className="w-full">
      <div className="mb-5">
        <h2
          className="font-heading font-extrabold tracking-tight text-foreground leading-tight mb-1"
          style={{ fontSize: "clamp(1.3rem, 2vw, 1.5rem)" }}
        >
          Sign in
        </h2>
        <p className="text-[0.78rem] text-muted-foreground">
          Welcome back — enter your details below.
        </p>
      </div>

      <SocialLogin />
      <Divider label="or sign in with email" />

      {unverified && <UnverifiedBanner />}
      {error && !unverified && (
        <p className="text-[0.75rem] text-destructive mb-3 text-center">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <InputField
          id="email"
          label="Email address"
          error={errors.email?.message}
          left={<Mail size={14} />}
          placeholder="you@example.com"
          autoComplete="email"
          {...register("email")}
        />

        <InputField
          id="password"
          label={
            <div className="flex items-center justify-between w-full">
              <span>Password</span>
              <Link
                to={authConfig.routes.forgotPassword}
                tabIndex={-1}
                className="text-[0.7rem] text-muted-foreground hover:text-[#a3e635] transition-colors duration-150 no-underline"
              >
                Forgot?
              </Link>
            </div>
          }
          error={errors.password?.message}
          left={<Lock size={14} />}
          right={
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPw((v) => !v)}
              className="hover:text-foreground transition-colors duration-150"
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          }
          placeholder="••••••••"
          type={showPw ? "text" : "password"}
          autoComplete="current-password"
          {...register("password")}
        />

        {/* Remember me */}
        <label className="flex items-center gap-2 cursor-pointer w-fit group">
          <div className="relative flex-shrink-0">
            <input
              {...register("rememberMe")}
              type="checkbox"
              className="peer sr-only"
            />
            <div className="w-3.5 h-3.5 rounded border border-input bg-card flex items-center justify-center peer-checked:bg-[#a3e635] peer-checked:border-[#a3e635] transition-colors duration-150" />
            <svg
              className="absolute inset-0 m-auto w-2 h-2 text-black opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
              viewBox="0 0 10 8"
              fill="none"
            >
              <path
                d="M1 4l2.5 2.5L9 1"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-[0.72rem] text-muted-foreground group-hover:text-foreground transition-colors select-none">
            Remember me
          </span>
        </label>

        <Button type="submit" isLoading={isLoading}>
          <span>Sign in</span>
          <ArrowRight size={14} />
        </Button>
      </form>

      <p className="text-[0.75rem] text-muted-foreground text-center mt-5">
        Don't have an account?{" "}
        <Link
          to={authConfig.routes.register}
          className="font-semibold font-heading text-foreground no-underline hover:text-[#a3e635] transition-colors duration-150"
        >
          Create one →
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
