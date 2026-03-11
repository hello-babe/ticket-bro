/**
 * EventTicketsSection.jsx
 * Ticket selection + booking CTA
 * Fields: event.tickets[] (Ticket refs — populated), isFree, minPrice, maxPrice,
 *         currency, totalCapacity, totalSold, spotsLeft, isSoldOut, canPurchase
 * Production: fetch ticket types from GET /api/events/:slug/ticket-types
 */
import React, { useState, forwardRef } from "react";
import {
  Ticket,
  Check,
  Lock,
  ChevronRight,
  Shield,
  Zap,
  Clock,
} from "lucide-react";
import { CapacityBar, PriceBadge } from "./shared/EventShared.jsx";

const MOCK_TICKETS = [
  {
    id: "general",
    label: "General",
    price: 1500,
    currency: "BDT",
    available: true,
    perks: ["Standing area", "Basic entry", "Merchandise access"],
  },
  {
    id: "silver",
    label: "Silver",
    price: 2500,
    currency: "BDT",
    available: true,
    perks: ["Reserved seating", "Priority entry", "Complimentary water"],
  },
  {
    id: "gold",
    label: "Gold",
    price: 5000,
    currency: "BDT",
    available: true,
    perks: [
      "Premium seating",
      "Backstage pass",
      "Meet & greet",
      "F&B included",
    ],
  },
  {
    id: "vip",
    label: "VIP",
    price: 10000,
    currency: "BDT",
    available: false,
    perks: ["Front row", "Full backstage", "Private lounge", "All inclusive"],
  },
];

const EventTicketsSection = forwardRef(({ event }, ref) => {
  const tickets = event.tickets?.length ? event.tickets : MOCK_TICKETS;
  const available = tickets.filter((t) => t.available !== false);
  const [selected, setSelected] = useState(
    available[1]?.id || available[0]?.id,
  );
  const [qty, setQty] = useState(1);

  const ticket = tickets.find((t) => t.id === selected);
  const total = ticket ? ticket.price * qty : 0;
  const spotsLeft = event.spotsLeft;
  const soldPct = event.soldPercentage || 0;
  const canPurchase = event.canPurchase !== false;

  return (
    <div ref={ref} className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3
          className="text-lg font-bold text-foreground"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Get Tickets
        </h3>
        {spotsLeft != null && spotsLeft < 50 && (
          <span
            className="flex items-center gap-1 text-[11px] font-semibold text-destructive"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            <Zap size={11} /> Only {spotsLeft} left
          </span>
        )}
      </div>

      {/* Capacity bar */}
      <div>
        <CapacityBar soldPercentage={soldPct} />
        <p
          className="text-[10px] text-muted-foreground mt-1"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {soldPct}% sold
          {spotsLeft != null &&
            ` · ${spotsLeft.toLocaleString()} spots remaining`}
        </p>
      </div>

      {/* Ticket tiers */}
      <div className="flex flex-col gap-2">
        {tickets.map((t) => {
          const isSelected = selected === t.id;
          const isSoldOut = t.available === false;
          return (
            <button
              key={t.id}
              onClick={() => !isSoldOut && setSelected(t.id)}
              disabled={isSoldOut}
              className="flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: isSelected ? "var(--foreground)" : "var(--border)",
                background: isSelected ? "var(--secondary)" : "var(--card)",
                boxShadow: isSelected
                  ? "inset 0 0 0 1px var(--foreground)"
                  : "none",
              }}
            >
              {/* Radio */}
              <span
                className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5"
                style={{
                  borderColor: isSelected
                    ? "var(--foreground)"
                    : "var(--border)",
                }}
              >
                {isSelected && (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: "var(--foreground)" }}
                  />
                )}
              </span>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-sm font-bold text-foreground"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {t.label}
                    {isSoldOut && (
                      <span className="ml-2 text-[10px] font-normal text-muted-foreground">
                        (Sold out)
                      </span>
                    )}
                  </span>
                  <span
                    className="text-sm font-extrabold text-foreground shrink-0"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    ৳{t.price?.toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                  {(t.perks || []).map((p, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1 text-[11px] text-muted-foreground"
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      <Check size={9} className="text-foreground" />
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quantity + total */}
      {ticket && (
        <div
          className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border"
          style={{ background: "var(--secondary)" }}
        >
          <div>
            <p
              className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Quantity
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-foreground hover:bg-background transition-colors text-base font-bold"
              >
                −
              </button>
              <span
                className="text-sm font-bold text-foreground w-5 text-center"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => Math.min(10, q + 1))}
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-foreground hover:bg-background transition-colors text-base font-bold"
              >
                +
              </button>
            </div>
          </div>
          <div className="text-right">
            <p
              className="text-[10px] text-muted-foreground uppercase tracking-wide"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Total
            </p>
            <p
              className="text-2xl font-extrabold text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              ৳{total.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* CTA */}
      <button
        disabled={!canPurchase || !ticket}
        className="flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.99]"
        style={{
          background: "var(--foreground)",
          color: "var(--background)",
          fontFamily: "var(--font-sans)",
        }}
      >
        <Ticket size={15} />
        {!canPurchase
          ? "Not Available"
          : `Book Now · ৳${total.toLocaleString()}`}
      </button>

      {/* Trust signals */}
      <div className="flex items-center justify-center gap-4 flex-wrap">
        {[
          { icon: Shield, text: "Secure checkout" },
          { icon: Zap, text: "Instant confirm" },
          { icon: Clock, text: "Refundable*" },
        ].map(({ icon: Icon, text }) => (
          <span
            key={text}
            className="flex items-center gap-1 text-[10px] text-muted-foreground"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            <Icon size={10} />
            {text}
          </span>
        ))}
      </div>
    </div>
  );
});

EventTicketsSection.displayName = "EventTicketsSection";
export default EventTicketsSection;
