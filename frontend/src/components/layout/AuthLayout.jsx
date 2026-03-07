// frontend/src/layouts/AuthLayout.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// ── Animated ticket grid ──────────────────────────────────────────────────────
const TicketGrid = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      overflow: "hidden",
      pointerEvents: "none",
    }}
  >
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 20,
        padding: 40,
        opacity: 0.07,
        transform: "rotate(-8deg) scale(1.25)",
        transformOrigin: "center",
      }}
    >
      {Array.from({ length: 28 }, (_, i) => (
        <div
          key={i}
          style={{
            height: 56,
            borderRadius: 8,
            border: "1.5px solid #a3e635",
            position: "relative",
            animation: `tf ${3 + (i % 4) * 0.6}s ease-in-out infinite alternate`,
            animationDelay: `${(i * 0.13) % 1.8}s`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "32%",
              top: -5,
              bottom: -5,
              width: 1,
              borderLeft: "1.5px dashed #a3e635",
            }}
          />
        </div>
      ))}
    </div>
    <style>{`@keyframes tf { from{transform:translateY(0);opacity:.5} to{transform:translateY(-10px);opacity:1} }`}</style>
  </div>
);

// ── Glow orbs ─────────────────────────────────────────────────────────────────
const Orbs = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      overflow: "hidden",
    }}
  >
    {[
      { top: "12%", left: "18%", size: 300, delay: "0s" },
      { bottom: "18%", right: "12%", size: 220, delay: "3s" },
    ].map((o, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          top: o.top,
          left: o.left,
          bottom: o.bottom,
          right: o.right,
          width: o.size,
          height: o.size,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(163,230,53,0.13) 0%, transparent 70%)",
          animation: `op 7s ease-in-out infinite ${i % 2 === 1 ? "reverse" : ""}`,
          animationDelay: o.delay,
        }}
      />
    ))}
    <style>{`@keyframes op { 0%,100%{transform:scale(1);opacity:.6} 50%{transform:scale(1.18);opacity:1} }`}</style>
  </div>
);

// ── Testimonials ──────────────────────────────────────────────────────────────
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

// ── Layout ────────────────────────────────────────────────────────────────────
const AuthLayout = ({ children }) => {
  const [tIdx, setTIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setTIdx((i) => (i + 1) % TESTIMONIALS.length),
      4500,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      {/* ── LEFT — Branding ──────────────────────────────────────────────── */}
      <div
        style={{
          background: "#0a0a0f",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "40px 52px",
          overflow: "hidden",
        }}
      >
        <TicketGrid />
        <Orbs />

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <Link
            to="/"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 11,
                background: "#a3e635",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                fontWeight: 900,
                color: "#000",
                letterSpacing: "-1px",
              }}
            >
              T
            </div>
            <span
              style={{
                fontSize: 17,
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.4px",
              }}
            >
              Ticket Bro
            </span>
          </Link>
        </div>

        {/* Center content */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Badge */}
          <div
            style={{
              display: "inline-block",
              background: "rgba(163,230,53,0.1)",
              border: "1px solid rgba(163,230,53,0.25)",
              borderRadius: 100,
              padding: "4px 14px",
              fontSize: 10,
              letterSpacing: "2.5px",
              color: "#a3e635",
              fontWeight: 700,
              marginBottom: 22,
            }}
          >
            DISCOVER · BOOK · EXPERIENCE
          </div>

          <h2
            style={{
              fontSize: "clamp(1.9rem, 3vw, 2.6rem)",
              fontWeight: 900,
              color: "#fff",
              lineHeight: 1.1,
              letterSpacing: "-1.5px",
              marginBottom: 14,
            }}
          >
            Your next unforgettable
            <br />
            <span style={{ color: "#a3e635" }}>experience</span> awaits.
          </h2>

          <p
            style={{
              fontSize: 13.5,
              color: "rgba(255,255,255,0.4)",
              lineHeight: 1.65,
              maxWidth: 340,
              marginBottom: 36,
            }}
          >
            Thousands of events. One platform. From underground gigs to stadium
            shows.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: 36, marginBottom: 44 }}>
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 900,
                    color: "#fff",
                    letterSpacing: "-0.5px",
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.3)",
                    letterSpacing: "1.5px",
                    marginTop: 3,
                  }}
                >
                  {label.toUpperCase()}
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial card */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16,
              padding: "20px 22px",
              maxWidth: 380,
            }}
          >
            <div
              style={{
                fontSize: 28,
                color: "#a3e635",
                marginBottom: 8,
                fontFamily: "Georgia, serif",
                lineHeight: 1,
              }}
            >
              "
            </div>
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.65,
                marginBottom: 14,
                minHeight: 42,
                transition: "opacity 0.4s",
              }}
            >
              {TESTIMONIALS[tIdx].quote}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#a3e635,#65a30d)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 800,
                  color: "#000",
                }}
              >
                {TESTIMONIALS[tIdx].name[0]}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.6)",
                    fontWeight: 600,
                  }}
                >
                  {TESTIMONIALS[tIdx].name}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.25)",
                    letterSpacing: "0.5px",
                  }}
                >
                  {TESTIMONIALS[tIdx].role}
                </div>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div style={{ display: "flex", gap: 6, marginTop: 16 }}>
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setTIdx(i)}
                style={{
                  width: i === tIdx ? 20 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: i === tIdx ? "#a3e635" : "rgba(255,255,255,0.15)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 0.3s",
                }}
              />
            ))}
          </div>
        </div>

        {/* Footer links */}
        <div
          style={{ position: "relative", zIndex: 1, display: "flex", gap: 20 }}
        >
          {["Privacy", "Terms", "Help"].map((l) => (
            <Link
              key={l}
              to={`/${l.toLowerCase()}`}
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.22)",
                textDecoration: "none",
                letterSpacing: "0.3px",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.target.style.color = "rgba(255,255,255,0.5)")
              }
              onMouseLeave={(e) =>
                (e.target.style.color = "rgba(255,255,255,0.22)")
              }
            >
              {l}
            </Link>
          ))}
        </div>
      </div>

      {/* ── RIGHT — Page content ─────────────────────────────────────────── */}
      <div
        style={{
          background: "var(--background, #ffffff)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 40px",
          overflowY: "auto",
          minHeight: "100vh",
        }}
      >
        <div style={{ width: "100%", maxWidth: 440 }}>{children}</div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          div[data-auth-layout] { grid-template-columns: 1fr !important; }
          div[data-auth-panel]  { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;
