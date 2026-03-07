// frontend/src/components/auth/ResetPasswordForm.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

import authService from "@/services/authService";
import { resetSchema } from "@/utils/validators";
import authConfig from "@/config/auth.config";

// Shared components barrel import
import { InputField, Button } from "@/components/shared";

const ResetPasswordForm = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");

  const [showPw, setShowPw] = useState(false);
  const [showCp, setShowCp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetSchema),
  });

  if (!token) {
    return (
      <div className="w-full text-center">
        <div className="w-12 h-12 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto mb-5">
          <Lock size={20} className="text-destructive" />
        </div>
        <h2
          className="font-heading font-extrabold tracking-tight text-foreground leading-tight mb-2"
          style={{ fontSize: "clamp(1.4rem, 2vw, 1.65rem)" }}
        >
          Invalid link
        </h2>
        <p className="text-[0.82rem] text-muted-foreground mb-6">
          This reset link is invalid or has expired.
        </p>
        <Link
          to={authConfig.routes.forgotPassword}
          className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-[#a3e635] text-black text-[0.875rem] font-semibold font-heading no-underline hover:brightness-110 transition-all duration-150"
        >
          Request new link
        </Link>
      </div>
    );
  }

  const onSubmit = async ({ password, confirmPassword }) => {
    setLoading(true);
    try {
      await authService.resetPassword({ token, password, confirmPassword });
      setDone(true);
      setTimeout(() => navigate(authConfig.routes.login), 2000);
    } catch (e) {
      toast.error(
        e.response?.data?.message || "Reset failed — link may have expired.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="w-full text-center">
        <div className="flex items-center justify-center mb-5">
          <CheckCircle2 size={48} style={{ color: "oklch(0.5 0.15 142)" }} />
        </div>
        <h2
          className="font-heading font-extrabold tracking-tight text-foreground leading-tight mb-2"
          style={{ fontSize: "clamp(1.4rem, 2vw, 1.65rem)" }}
        >
          Password reset!
        </h2>
        <p className="text-[0.82rem] text-muted-foreground">
          Redirecting you to sign in…
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-7">
        <h2
          className="font-heading font-extrabold tracking-tight text-foreground leading-tight mb-1.5"
          style={{ fontSize: "clamp(1.4rem, 2vw, 1.65rem)" }}
        >
          New password
        </h2>
        <p className="text-[0.82rem] text-muted-foreground">
          Choose a strong, unique password for your account.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <InputField
          id="password"
          label="New password"
          error={errors.password?.message}
          left={<Lock size={15} />}
          right={
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPw((v) => !v)}
              className="hover:text-foreground transition-colors duration-150"
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
          type={showPw ? "text" : "password"}
          placeholder="••••••••"
          autoComplete="new-password"
          {...register("password")}
        />

        <InputField
          id="confirmPassword"
          label="Confirm password"
          error={errors.confirmPassword?.message}
          left={<Lock size={15} />}
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
              {showCp ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
          type={showCp ? "text" : "password"}
          placeholder="••••••••"
          autoComplete="new-password"
          {...register("confirmPassword")}
        />

        <Button type="submit" isLoading={loading}>
          <span>Set new password</span>
          <ArrowRight size={15} />
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
