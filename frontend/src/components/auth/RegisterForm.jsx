// frontend/src/components/auth/RegisterForm.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
} from "lucide-react";

import { registerSchema, getPasswordStrength } from "@/utils/validators";
import useAuth from "@/context/AuthContext";
import SocialLogin from "./SocialLogin";
import authConfig from "@/config/auth.config";

// Shared components barrel import
import { InputField, Button, Divider } from "@/components/shared";

// Password requirement indicator
const Req = ({ met, label }) => (
  <div className="flex items-center gap-1.5">
    <div
      className="w-3.5 h-3.5 rounded-full flex-shrink-0 flex items-center justify-center transition-colors duration-200"
      style={{ background: met ? "oklch(0.5 0.15 142)" : "var(--border)" }}
    >
      {met && <Check size={8} color="white" strokeWidth={3} />}
    </div>
    <span
      className={`${met ? "text-foreground" : "text-muted-foreground"} text-[0.65rem] transition-colors duration-200`}
    >
      {label}
    </span>
  </div>
);

const RegisterForm = () => {
  const { register: registerUser, isLoading, error } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [showCp, setShowCp] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const pw = watch("password", "");
  const strength = getPasswordStrength(pw);
  const reqs = [
    { label: "8+ characters", met: pw.length >= 8 },
    { label: "Uppercase", met: /[A-Z]/.test(pw) },
    { label: "Number", met: /[0-9]/.test(pw) },
    { label: "Special char", met: /[@$!%*?&]/.test(pw) },
  ];

  return (
    <div className="w-full">
      <div className="mb-5">
        <h2
          className="font-heading font-extrabold tracking-tight text-foreground leading-tight mb-1"
          style={{ fontSize: "clamp(1.3rem, 2vw, 1.5rem)" }}
        >
          Create account
        </h2>
        <p className="text-[0.78rem] text-muted-foreground">
          Sign up for free — no credit card required.
        </p>
      </div>

      <SocialLogin />
      <Divider label="or register with email" />

      {error && (
        <p className="text-[0.75rem] text-destructive mb-3 text-center">
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit(registerUser)}
        className="flex flex-col gap-3"
      >
        {/* Name fields */}
        <div className="grid grid-cols-2 gap-2.5">
          <InputField
            id="firstName"
            label="First name"
            error={errors.firstName?.message}
            left={<User size={14} />}
            placeholder="John"
            {...register("firstName")}
          />
          <InputField
            id="lastName"
            label="Last name"
            error={errors.lastName?.message}
            left={<User size={14} />}
            placeholder="Doe"
            {...register("lastName")}
          />
        </div>

        {/* Email */}
        <InputField
          id="email"
          label="Email address"
          error={errors.email?.message}
          left={<Mail size={14} />}
          placeholder="you@example.com"
          autoComplete="email"
          {...register("email")}
        />

        {/* Phone */}
        <InputField
          id="phone"
          label={
            <span>
              Phone{" "}
              <span className="text-[0.65rem] font-normal text-muted-foreground">
                (optional)
              </span>
            </span>
          }
          left={<Phone size={14} />}
          placeholder="+1 234 567 8900"
          {...register("phone")}
        />

        {/* Password */}
        <div className="flex flex-col gap-0">
          <InputField
            id="password"
            label="Password"
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
            type={showPw ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="new-password"
            {...register("password")}
          />

          {pw && (
            <div className="mt-2 flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${strength.pct}%`,
                      background: strength.color,
                    }}
                  />
                </div>
                <span
                  className="text-[0.65rem] font-semibold font-heading min-w-[48px] text-right transition-colors duration-200"
                  style={{ color: strength.color }}
                >
                  {strength.label}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                {reqs.map((r) => (
                  <Req key={r.label} {...r} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <InputField
          id="confirmPassword"
          label="Confirm password"
          error={errors.confirmPassword?.message}
          left={<Lock size={14} />}
          right={
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowCp((v) => !v)}
              className="hover:text-foreground transition-colors duration-150"
              aria-label={
                showCp ? "Hide confirm password" : "Show confirm password"
              }
            >
              {showCp ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          }
          type={showCp ? "text" : "password"}
          placeholder="••••••••"
          autoComplete="new-password"
          {...register("confirmPassword")}
        />

        <Button type="submit" isLoading={isLoading}>
          <span>Create account</span>
          <ArrowRight size={14} />
        </Button>
      </form>

      <p className="text-[0.75rem] text-muted-foreground text-center mt-5">
        Already have an account?{" "}
        <Link
          to={authConfig.routes.login}
          className="font-semibold font-heading text-foreground no-underline hover:text-[#a3e635] transition-colors duration-150"
        >
          Sign in →
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
