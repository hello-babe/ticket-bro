import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Mail, ArrowRight, ArrowLeft, MailCheck } from "lucide-react";
import toast from "react-hot-toast";

import authService from "@/api/auth.api";
import { forgotSchema } from "@/utils/validators";
import authConfig from "@/config/auth.config";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const Field = ({ id, label, error, left, right, className, ...props }) => (
  <div className="flex flex-col gap-1 w-full">
    {label && (
      <Label
        htmlFor={id}
        className="text-[0.75rem] font-medium cursor-pointer select-none"
      >
        {label}
      </Label>
    )}
    <div
      className={cn(
        "flex items-center gap-2 px-3 h-10 rounded-lg border transition-colors duration-150 cursor-text focus-within:ring-2 focus-within:ring-ring/30",
        error
          ? "border-destructive bg-destructive/5"
          : "border-input bg-card hover:border-ring/60",
      )}
      onClick={() => document.getElementById(id)?.focus()}
    >
      {left && (
        <span className="flex-shrink-0 text-muted-foreground leading-none">
          {left}
        </span>
      )}
      <input
        id={id}
        className={cn(
          "flex-1 min-w-0 w-full bg-transparent outline-none border-none text-[0.875rem] text-foreground placeholder:text-muted-foreground/50",
          "[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_hsl(var(--card))] [&:-webkit-autofill]:[-webkit-text-fill-color:hsl(var(--foreground))]",
          "[&:-webkit-autofill:focus]:shadow-[inset_0_0_0_1000px_hsl(var(--card))] [&:-webkit-autofill]:transition-[background-color_9999s_ease]",
          className,
        )}
        {...props}
      />
      {right && (
        <span className="flex-shrink-0 text-muted-foreground leading-none">
          {right}
        </span>
      )}
    </div>
    {error && (
      <p className="text-[0.7rem] text-destructive leading-none mt-0.5">
        {error}
      </p>
    )}
  </div>
);

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
        <Field
          id="email"
          label="Email address"
          error={errors.email?.message}
          left={<Mail size={15} />}
          placeholder="you@example.com"
          autoComplete="email"
          {...register("email")}
        />

        <Button type="submit" className="w-full mt-1" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
              Sending…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Send reset link <ArrowRight size={15} />
            </span>
          )}
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
