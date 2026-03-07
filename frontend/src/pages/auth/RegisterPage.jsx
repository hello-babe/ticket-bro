// frontend/src/pages/auth/RegisterPage.jsx
// Route: /auth/register

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail, Lock, Eye, EyeOff, Phone, ArrowRight } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";
import {
  Field,
  SubmitBtn,
  Divider,
  SocialLogins,
  AuthHeading,
  ErrorBanner,
  AuthFooter,
  PasswordChecklist,
} from "./_authShared";
import useAuth from "@/context/AuthContext";
import { ROUTES } from "@/app/AppRoutes";

const schema = z
  .object({
    firstName: z.string().min(1, "First name is required").max(50),
    lastName: z.string().min(1, "Last name is required").max(50),
    email: z.string().email("Enter a valid email address"),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "One uppercase letter required")
      .regex(/[0-9]/, "One number required")
      .regex(/[@$!%*?&]/, "One special character required"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const RegisterPage = () => {
  const { register: registerUser, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [showCp, setShowCp] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  const pw = watch("password", "");

  const onSubmit = async (data) => {
    clearError?.();
    const result = await registerUser(data);
    if (!result?.error) {
      // authSlice now discards tokens — navigate to verify notice
      navigate(ROUTES.AUTH.VERIFY_EMAIL + "?notice=true", { replace: true });
    }
  };

  const handleGoogle = () =>
    (window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`);
  const handleFacebook = () =>
    (window.location.href = `${import.meta.env.VITE_API_URL}/auth/facebook`);

  return (
    <AuthLayout>
      <AuthHeading
        title="Create account"
        subtitle="Join Ticket Bro and never miss an event."
      />

      <SocialLogins googleFn={handleGoogle} facebookFn={handleFacebook} />

      <div style={{ margin: "16px 0" }}>
        <Divider label="or sign up with email" />
      </div>

      <ErrorBanner message={error} />

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          marginTop: 8,
        }}
      >
        {/* Name row */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <Field
            label="First name"
            error={errors.firstName?.message}
            left={<User size={15} />}
          >
            <input
              className="af-input"
              {...register("firstName")}
              type="text"
              placeholder="John"
              autoComplete="given-name"
            />
          </Field>
          <Field label="Last name" error={errors.lastName?.message}>
            <input
              className="af-input"
              {...register("lastName")}
              type="text"
              placeholder="Doe"
              autoComplete="family-name"
            />
          </Field>
        </div>

        <Field
          label="Email address"
          error={errors.email?.message}
          left={<Mail size={15} />}
        >
          <input
            className="af-input"
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </Field>

        <Field
          label="Phone (optional)"
          error={errors.phone?.message}
          left={<Phone size={15} />}
        >
          <input
            className="af-input"
            {...register("phone")}
            type="tel"
            placeholder="+1 234 567 8900"
            autoComplete="tel"
          />
        </Field>

        <Field
          label="Password"
          error={errors.password?.message}
          left={<Lock size={15} />}
          right={
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                color: "inherit",
              }}
            >
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
        >
          <input
            className="af-input"
            {...register("password")}
            type={showPw ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </Field>

        <PasswordChecklist password={pw} />

        <Field
          label="Confirm password"
          error={errors.confirmPassword?.message}
          left={<Lock size={15} />}
          right={
            <button
              type="button"
              onClick={() => setShowCp((v) => !v)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                color: "inherit",
              }}
            >
              {showCp ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
        >
          <input
            className="af-input"
            {...register("confirmPassword")}
            type={showCp ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </Field>

        {/* Terms agreement */}
        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <input
            type="checkbox"
            required
            style={{
              width: 14,
              height: 14,
              accentColor: "#a3e635",
              cursor: "pointer",
              marginTop: 2,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 12,
              color: "var(--muted-foreground,#6b7280)",
              lineHeight: 1.55,
            }}
          >
            I agree to the{" "}
            <a
              href={ROUTES.STATIC.TERMS}
              style={{
                color: "var(--foreground,#111)",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href={ROUTES.STATIC.PRIVACY}
              style={{
                color: "var(--foreground,#111)",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Privacy Policy
            </a>
          </span>
        </label>

        <SubmitBtn loading={isLoading}>
          Create account <ArrowRight size={15} />
        </SubmitBtn>
      </form>

      <AuthFooter
        text="Already have an account?"
        linkText="Sign in →"
        to={ROUTES.AUTH.LOGIN}
      />
    </AuthLayout>
  );
};

export default RegisterPage;
