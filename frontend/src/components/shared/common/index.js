// ─── shared/common — barrel export ───────────────────────────────────────────

// App-specific auto-breadcrumb with full route awareness
export { default as Breadcrumb }                       from "./Breadcrumb";

// "or sign in with email" labeled divider — Separator can't do this
export { default as Divider }                          from "./Divider";

// Email-not-verified banner — app-specific
export { default as UnverifiedBanner }                 from "./UnverifiedBanner";

// Custom toast system — loading state, promise helper, context
export { ToastProvider, useToast, toast, TOAST_TYPES } from "./Sooner";
