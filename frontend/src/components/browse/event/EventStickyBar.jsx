/**
 * EventStickyBar.jsx
 * Sticky bottom booking bar — appears on scroll
 * Fields: event.title, startDate, location, minPrice, isFree, canPurchase
 */
import React, { useState, useEffect } from "react";
import { Ticket, ChevronUp } from "lucide-react";
import Container from "@/components/layout/Container";
import { fmtDateShort, fmtTime } from "./shared/EventShared.jsx";

const EventStickyBar = ({ event, onBook }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const priceLabel = event.isFree
    ? "Free"
    : `From ৳${event.minPrice?.toLocaleString()}`;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border shadow-2xl transition-transform duration-300"
      style={{
        background: "var(--background)",
        transform: visible ? "translateY(0)" : "translateY(100%)",
      }}
    >
      <Container>
        <div className="flex items-center justify-between gap-4 py-3">
          <div className="min-w-0 hidden sm:block">
            <p
              className="text-sm font-bold text-foreground truncate"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {event.title}
            </p>
            <p
              className="text-xs text-muted-foreground"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {fmtDateShort(event.startDate)} · {fmtTime(event.startDate)} ·{" "}
              {event.location?.name || event.location?.city}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 ml-auto">
            <div className="text-right">
              <p
                className="text-[10px] text-muted-foreground uppercase tracking-wide"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Price
              </p>
              <p
                className="text-lg font-extrabold text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {priceLabel}
              </p>
            </div>
            <button
              onClick={onBook}
              className="flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98]"
              style={{
                background: "var(--foreground)",
                color: "var(--background)",
                fontFamily: "var(--font-sans)",
              }}
            >
              <Ticket size={14} /> Get Tickets
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default EventStickyBar;
