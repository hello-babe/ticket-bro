import React from "react";

const InputField = ({
  label,
  id,
  error,
  left,
  right,
  className = "",
  ...props
}) => (
  <div className="flex flex-col gap-1 w-full">
    {label && (
      <label
        htmlFor={id}
        className="text-[0.75rem] font-medium text-foreground cursor-pointer select-none"
      >
        {label}
      </label>
    )}
    <div
      className={[
        "flex items-center gap-2 px-3 h-10 rounded-lg border transition-colors duration-150",
        "cursor-text",
        "focus-within:ring-2 focus-within:ring-ring/30",
        error
          ? "border-destructive bg-destructive/5"
          : "border-input bg-card hover:border-ring/60",
      ].join(" ")}
      onClick={() => document.getElementById(id)?.focus()}
    >
      {left && (
        <span className="flex-shrink-0 text-muted-foreground leading-none">
          {left}
        </span>
      )}

      <input
        id={id}
        className={[
          "flex-1 min-w-0 w-full", // min-w-0 prevents flex overflow on small screens
          "bg-transparent outline-none border-none",
          "text-[0.875rem] text-foreground placeholder:text-muted-foreground/50",
          // ── Autofill fix ──────────────────────────────────────────────────
          // Chrome/Edge/Safari inject a solid background + their own text color
          // on autofill. We use box-shadow to "paint over" that background and
          // force the text color to stay correct.
          "[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_hsl(var(--card))]",
          "[&:-webkit-autofill]:[-webkit-text-fill-color:hsl(var(--foreground))]",
          "[&:-webkit-autofill:focus]:shadow-[inset_0_0_0_1000px_hsl(var(--card))]",
          "[&:-webkit-autofill:hover]:shadow-[inset_0_0_0_1000px_hsl(var(--card))]",
          // transition so the autofill doesn't flash on page load
          "[&:-webkit-autofill]:transition-[background-color_9999s_ease]",
          className,
        ].join(" ")}
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

export default InputField;
