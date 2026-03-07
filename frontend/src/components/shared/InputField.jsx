import React from "react";

const InputField = ({ label, id, error, left, right, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label
        htmlFor={id}
        className="text-[0.75rem] font-medium text-foreground cursor-pointer"
      >
        {label}
      </label>
    )}
    <div
      className={[
        "flex items-center gap-2 px-3 h-10 rounded-lg border bg-card transition-colors duration-150",
        "cursor-text", // make the whole area clickable
        "focus-within:ring focus-within:ring-ring focus-within:ring-opacity-30", // subtle ring on focus
        error
          ? "border-destructive"
          : "border-input hover:border-ring/60",
      ].join(" ")}
      onClick={() => document.getElementById(id)?.focus()} // focus input if container is clicked
    >
      {left && <span className="flex-shrink-0 text-muted-foreground">{left}</span>}
      <input
        id={id}
        className="flex-1 bg-transparent outline-none border-none text-[0.875rem] text-foreground placeholder:text-muted-foreground/50"
        {...props}
      />
      {right && <span className="flex-shrink-0 text-muted-foreground">{right}</span>}
    </div>
    {error && <p className="text-[0.7rem] text-destructive leading-none">{error}</p>}
  </div>
);

export default InputField;