import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const sides = {
  right:  { panel: "inset-y-0 right-0 h-full w-[min(480px,100vw)]",  enter: "translate-x-full",  active: "translate-x-0" },
  left:   { panel: "inset-y-0 left-0 h-full w-[min(480px,100vw)]",   enter: "-translate-x-full", active: "translate-x-0" },
  bottom: { panel: "inset-x-0 bottom-0 w-full max-h-[90vh]",         enter: "translate-y-full",  active: "translate-y-0" },
  top:    { panel: "inset-x-0 top-0 w-full max-h-[90vh]",            enter: "-translate-y-full", active: "translate-y-0" },
};

const Drawer = ({
  open,
  onClose,
  side = "right",
  title,
  description,
  children,
  footer,
  className,
  overlayClassName,
}) => {
  const cfg = sides[side] ?? sides.right;
  const firstFocusRef = useRef(null);

  // Trap body scroll & focus
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => firstFocusRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Esc to close
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose?.(); };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={cn("fixed inset-0 z-50 bg-black/50 backdrop-blur-sm", overlayClassName)}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title ?? "Drawer"}
        className={cn(
          "fixed z-50 flex flex-col bg-background border-border shadow-2xl",
          "transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          cfg.panel,
          open ? cfg.active : cfg.enter,
          side === "left" || side === "right" ? "border-x" : "border-y",
          className
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-border shrink-0">
            <div>
              <h2 className="text-base font-semibold text-foreground leading-none">{title}</h2>
              {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
            </div>
            <button
              ref={firstFocusRef}
              onClick={onClose}
              aria-label="Close"
              className="shrink-0 flex items-center justify-center size-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        )}
        {/* Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
        {/* Footer */}
        {footer && (
          <div className="shrink-0 border-t border-border px-5 py-4">{footer}</div>
        )}
      </div>
    </>
  );
};

export default Drawer;
