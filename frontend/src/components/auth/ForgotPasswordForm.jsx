import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Mail, ArrowRight, ArrowLeft, MailCheck } from "lucide-react";
import toast from "react-hot-toast";

import authService from "@/api/auth.api";
import { forgotSchema } from "@/utils/validators";
import authConfig from "@/config/auth.config";

// Shared components barrel import
import { InputField, Button } from "@/components/shared/common";

const ForgotPasswordForm = () => {
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotSchema) });

  const onSubmit = async ({ email }) => {
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSentEmail(email);
      setSent(true);
    } catch (e) {
      toast.error(e.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // ── Success state ────────────────────────────────────────────────
  if (sent) {
    return (
      <div className="w-full text-center">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center mx-auto mb-5">
          <MailCheck size={20} className="text-foreground" />
        </div>

        <h2
          className="font-heading font-extrabold tracking-tight text-foreground leading-tight mb-2"
          style={{ fontSize: "clamp(1.4rem, 2vw, 1.65rem)" }}
        >
          Check your inbox
        </h2>

        <p className="text-[0.82rem] text-muted-foreground mb-1">
          Reset link sent to
        </p>
        <p className="text-[0.88rem] font-semibold font-heading text-foreground mb-6">
          {sentEmail}
        </p>

        <p className="text-[0.78rem] text-muted-foreground mb-6">
          Didn't receive it?{" "}
          <button
            onClick={() => setSent(false)}
            className="text-foreground font-semibold bg-transparent border-none p-0 cursor-pointer hover:text-[#a3e635] transition-colors duration-150"
          >
            Try again
          </button>
        </p>

        <Link
          to={authConfig.routes.login}
          className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg border border-border bg-transparent text-foreground text-[0.875rem] font-medium no-underline hover:border-[#a3e635]/40 hover:bg-[#a3e635]/[0.04] transition-colors duration-150"
        >
          <ArrowLeft size={13} />
          Back to sign in
        </Link>
      </div>
    );
  }

  // ── Default state ───────────────────────────────────────────────
  return (
    <div className="w-full ">
      {/* Header */}
      <div className="mb-4">
        <h2
          className="font-heading font-extrabold tracking-tight text-foreground leading-tight mb-1.5"
          style={{ fontSize: "clamp(1.4rem, 2vw, 1.65rem)" }}
        >
          Reset password
        </h2>
        <p className="text-[0.82rem] text-muted-foreground">
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <InputField
          id="email"
          label="Email address"
          error={errors.email?.message}
          left={<Mail size={15} />}
          placeholder="you@example.com"
          autoComplete="email"
          {...register("email")}
        />

        <Button type="submit" isLoading={loading}>
          <span>Send reset link</span>
          <ArrowRight size={15} />
        </Button>
      </form>

      {/* Back link */}
      <div className="text-center mt-6">
        <Link
          to={authConfig.routes.login}
          className="inline-flex items-center gap-1.5 text-[0.8rem] text-muted-foreground no-underline hover:text-[#a3e635] transition-colors duration-150"
        >
          <ArrowLeft size={13} />
          Back to sign in
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
