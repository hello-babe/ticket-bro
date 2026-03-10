// frontend/src/components/layout/AuthLayout.jsx
//
// Full-page auth layout (System B). Used by /auth/* page routes.
//
// Props:
//   public (bool) — if true, skip the "redirect authenticated users" guard.
//                   Use this for /auth/verify-email and /auth/oauth-success
//                   which must be accessible to everyone (they're email link
//                   destinations and OAuth callbacks).
//
// All other auth pages (login, register, forgot-password, etc) will redirect
// already-logged-in users back to "/" so they can't see the form.

import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectIsLoading,
} from "@/store/slices/authSlice";
import authConfig from "@/config/auth.config";

// ── Testimonial data ──────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote:
      "Found my favourite band's secret show through Ticket Bro. Life-changing.",
    name: "Anika R.",
    role: "Music fan",
  },
  {
    quote: "Best ticket platform I've used. Fast, clean, zero hidden fees.",
    name: "James K.",
    role: "Event-goer",
  },
  {
    quote:
      "Sold out 3 events using Ticket Bro. The organizer tools are incredible.",
    name: "Priya M.",
    role: "Organizer",
  },
];

const STATS = [
  { value: "50K+", label: "Events" },
  { value: "2M+", label: "Tickets sold" },
  { value: "180+", label: "Cities" },
];

// ── Layout component ──────────────────────────────────────────────────────────
const AuthLayout = ({ children, public: isPublic = false }) => {
  const [tIdx, setTIdx] = useState(0);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);

  // Rotate testimonials
  useEffect(() => {
    const id = setInterval(
      () => setTIdx((i) => (i + 1) % TESTIMONIALS.length),
      4500,
    );
    return () => clearInterval(id);
  }, []);

  // While restoring session from httpOnly cookie, show a minimal loader
  // to avoid redirecting prematurely (isAuthenticated starts false on reload).
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--background, #fff)",
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            border: "2.5px solid transparent",
            borderTopColor: "#a3e635",
            animation: "alspin .7s linear infinite",
          }}
        />
        <style>{`@keyframes alspin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  // Redirect authenticated users away from guest-only pages
  if (!isPublic && isAuthenticated) {
    return <Navigate to={authConfig.routes.home} replace />;
  }

  const t = TESTIMONIALS[tIdx];

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 font-sans">
      {/* ── MOBILE TOP BAR ─────────────────────────────────────────────── */}
      <header className="md:hidden col-span-full flex items-center justify-between px-5 py-3 border-b border-border">
        <Link to="/" className="inline-flex items-center gap-2 no-underline">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] border border-primary text-sm font-black text-primary">
            T
          </div>
          <span className="text-sm font-extrabold tracking-tight text-foreground">
            Ticket<span className="text-primary">Bro</span>
          </span>
        </Link>
        <div className="flex items-center gap-5">
          {STATS.slice(0, 2).map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-xs font-black leading-none text-foreground">
                {value}
              </p>
              <p className="mt-0.5 text-[8px] uppercase tracking-widest text-muted-foreground">
                {label}
              </p>
            </div>
          ))}
        </div>
      </header>

      {/* ── LEFT PANEL ─────────────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col justify-between relative overflow-hidden border-r border-border p-10 lg:p-14">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-2.5 no-underline">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-primary text-lg font-black text-primary">
            TB
          </div>
          <span className="text-base font-extrabold tracking-tight text-foreground">
            Ticket<span className="text-primary">Bro</span>
          </span>
        </Link>

        {/* Headline + stats */}
        <div className="flex flex-col">
          <span className="mb-5 self-start rounded-full border border-primary/30 px-3.5 py-1 text-[9px] font-bold uppercase tracking-[2.5px] text-primary">
            Discover · Book · Experience
          </span>

          <h2 className="mb-3 font-black leading-[1.08] tracking-tight text-foreground text-3xl lg:text-4xl xl:text-5xl">
            Your next unforgettable
            <br />
            <span className="text-primary">experience</span> awaits.
          </h2>

          <p className="mb-8 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Thousands of events. One platform. From underground gigs to stadium
            shows.
          </p>

          <div className="mb-9 flex flex-wrap gap-x-8 gap-y-3">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="text-xl font-black tracking-tight text-foreground lg:text-2xl">
                  {value}
                </p>
                <p className="mt-0.5 text-[9px] uppercase tracking-widest text-muted-foreground">
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Testimonial card */}
          <div className="max-w-sm rounded-2xl border border-border px-5 py-[18px]">
            <p className="mb-1.5 font-serif text-2xl leading-none text-primary">
              "
            </p>
            <p className="mb-3 min-h-[40px] text-xs leading-relaxed text-muted-foreground">
              {t.quote}
            </p>
            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary text-[10px] font-black text-primary">
                {t.name[0]}
              </div>
              <div>
                <p className="text-[11px] font-semibold text-foreground">
                  {t.name}
                </p>
                <p className="mt-0.5 text-[9px] tracking-wide text-muted-foreground">
                  {t.role}
                </p>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="mt-3.5 flex items-center gap-1.5">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setTIdx(i)}
                className={`h-[5px] rounded-full border-0 p-0 cursor-pointer transition-all duration-300
                  ${i === tIdx ? "w-4 bg-primary" : "w-[5px] bg-border hover:bg-muted-foreground"}`}
              />
            ))}
          </div>
        </div>

        {/* Footer links */}
        <footer className="flex flex-wrap gap-x-5 gap-y-1">
          {["Privacy", "Terms", "Help"].map((l) => (
            <Link
              key={l}
              to={`/${l.toLowerCase()}`}
              className="text-[10px] tracking-wide text-muted-foreground no-underline hover:text-foreground transition-colors duration-200"
            >
              {l}
            </Link>
          ))}
        </footer>
      </aside>

      {/* ── RIGHT PANEL — form content ──────────────────────────────────── */}
      <main className="flex flex-col items-center justify-center overflow-y-auto min-h-[calc(100vh-52px)] md:min-h-screen px-5 py-10 sm:px-10 sm:py-14">
        <div className="w-full max-w-[420px]">{children}</div>
      </main>
    </div>
  );
};

export default AuthLayout;
