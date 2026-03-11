/**
 * EventDetailsPage.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Route: /:categorySlug/:subCategorySlug/:eventTypeSlug/:eventSlug
 *        /events/:eventSlug  (legacy redirect)
 *
 * Architecture:
 *   - Uses useEventDetails() hook for data + loading states
 *   - All UI broken into section components in /components/event/sections/
 *   - Layout: full-bleed hero → 2-col (details left, sticky tickets right)
 *   - Sticky BookingBar appears on scroll (mobile-first)
 *   - Breadcrumb auto-generated from route params
 *
 * Data flow (production):
 *   useEventDetails(slug) → dispatch(fetchEventBySlug) → GET /api/events/:slug
 *   All fields mapped via normaliseEvent() from event.model.js
 *
 * Mock data:
 *   MOCK_EVENT in /data/eventDetailMock.js (one event, full shape)
 *   Swap out for real API by replacing useEventDetails() implementation
 * ─────────────────────────────────────────────────────────────────────────────
 */
import React, { useRef, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronLeft, AlertCircle, Loader2 } from "lucide-react";

import Container from "@/components/layout/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";

// ── Event section components ───────────────────────────────────────────────
import {
  EventHeroSection,
  EventAboutSection,
  EventLineupSection,
  EventAgendaSection,
  EventTicketsSection,
  EventVenueSection,
  EventOrganizerSection,
  EventReviewsSection,
  EventFAQSection,
  EventSponsorsSection,
  EventRelatedSection,
  EventStickyBar,
} from "@/components/browse/event";

// ── Mock data (replace with API hook in production) ───────────────────────
import MOCK_EVENT from "./eventDetailMock";

/* ═══════════════════════════════════════════════════════════════════════════
   LOADING STATE
═══════════════════════════════════════════════════════════════════════════ */
const EventLoading = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <Loader2 size={28} className="text-muted-foreground animate-spin" />
      <p className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-sans)" }}>
        Loading event…
      </p>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════
   NOT FOUND STATE
═══════════════════════════════════════════════════════════════════════════ */
const EventNotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center border border-border"
          style={{ background: "var(--secondary)" }}>
          <AlertCircle size={24} className="text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1"
            style={{ fontFamily: "var(--font-heading)" }}>Event not found</h2>
          <p className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-sans)" }}>
            This event may have been removed or the link is incorrect.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-border text-sm font-medium hover:bg-accent "
            style={{ fontFamily: "var(--font-sans)" }}>
            <ChevronLeft size={14} /> Go Back
          </button>
          <Link to="/browse"
            className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            style={{ background: "var(--foreground)", color: "var(--background)", fontFamily: "var(--font-sans)" }}>
            Browse Events
          </Link>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION DIVIDER
═══════════════════════════════════════════════════════════════════════════ */
const SDiv = () => <div className="border-t border-border" />;

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */
const EventDetailsPage = () => {
  const { categorySlug, subCategorySlug, eventTypeSlug, eventSlug } = useParams();

  // ── State ────────────────────────────────────────────────────────────
  const [saved,  setSaved]  = useState(false);
  const [shared, setShared] = useState(false);
  const ticketsRef = useRef(null);

  // ── Data ─────────────────────────────────────────────────────────────
  // Production: replace with real hook
  //   const { event, isLoading, notFound } = useEventDetails(eventSlug);
  const isLoading = false;
  const event     = MOCK_EVENT;
  const notFound  = !event && !isLoading;

  // ── Scroll behaviour ──────────────────────────────────────────────────
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [eventSlug]);

  // ── Handlers ─────────────────────────────────────────────────────────
  const handleSave = () => setSaved((p) => !p);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: event?.title, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      });
    }
  };

  const scrollToTickets = () => {
    ticketsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ── Guards ────────────────────────────────────────────────────────────
  if (isLoading) return <EventLoading />;
  if (notFound)  return <EventNotFound />;

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background" style={{ paddingBottom: 80 }}>

      {/* ── Breadcrumb ──────────────────────────────────────────────── */}
      <div className="border-b border-border" style={{ background: "var(--background)" }}>
        <Container>
          <div className="py-3">
            <Breadcrumb />
          </div>
        </Container>
      </div>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <EventHeroSection
        event={event}
        saved={saved}
        onSave={handleSave}
        onShare={handleShare}
        onBook={scrollToTickets}
      />

      {/* ── Main content grid ────────────────────────────────────────── */}
      <Container>
        <div className="py-8 xl:py-12 grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8 xl:gap-12">

          {/* ────────────────────────────────────────────────────────────
              LEFT COLUMN — Full event details
          ────────────────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-10 min-w-0">

            {/* About */}
            <EventAboutSection event={event} />
            <SDiv />

            {/* Lineup — only if has performers */}
            {(event.lineup?.length > 0) && (
              <>
                <EventLineupSection event={event} />
                <SDiv />
              </>
            )}

            {/* Agenda / Schedule */}
            {(event.agenda?.length > 0 || event.schedule?.length > 0) && (
              <>
                <EventAgendaSection event={event} />
                <SDiv />
              </>
            )}

            {/* Venue */}
            <EventVenueSection event={event} />
            <SDiv />

            {/* Organizer */}
            <EventOrganizerSection event={event} />
            <SDiv />

            {/* Sponsors — only if present */}
            {event.sponsors?.length > 0 && (
              <>
                <EventSponsorsSection event={event} />
                <SDiv />
              </>
            )}

            {/* Reviews */}
            <EventReviewsSection event={event} />
            <SDiv />

            {/* FAQ */}
            <EventFAQSection event={event} />

            {/* Mobile Tickets — below all content on mobile */}
            <div className="xl:hidden" ref={ticketsRef}>
              <SDiv />
              <div className="mt-10 p-5 rounded-2xl border border-border"
                style={{ background: "var(--card)" }}>
                <EventTicketsSection event={event} />
              </div>
            </div>

          </div>

          {/* ────────────────────────────────────────────────────────────
              RIGHT COLUMN — Sticky ticket sidebar (desktop only)
          ────────────────────────────────────────────────────────────── */}
          <div className="hidden xl:block">
            <div ref={ticketsRef} className="sticky top-24">
              <div className="rounded-2xl border border-border p-6"
                style={{ background: "var(--card)" }}>
                <EventTicketsSection event={event} />
              </div>

              {/* Quick info card below tickets */}
              <div className="mt-4 p-4 rounded-xl border border-border flex flex-col gap-2"
                style={{ background: "var(--secondary)" }}>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                  style={{ fontFamily: "var(--font-sans)" }}>
                  Quick Info
                </p>
                {[
                  { label: "Category",    value: event.category?.name    || "–" },
                  { label: "Sub-Category",value: event.subcategory?.name || "–" },
                  { label: "Event Type",  value: event.eventType?.name   || "–" },
                  { label: "Language",    value: "Bengali / English"         },
                  { label: "Currency",    value: event.currency || "BDT"     },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start justify-between gap-2">
                    <span className="text-[11px] text-muted-foreground"
                      style={{ fontFamily: "var(--font-sans)" }}>{label}</span>
                    <span className="text-[11px] font-medium text-foreground text-right"
                      style={{ fontFamily: "var(--font-sans)" }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </Container>

      {/* ── Related Events ───────────────────────────────────────────── */}
      <EventRelatedSection event={event} />

      {/* ── Sticky Booking Bar (scroll-triggered) ────────────────────── */}
      <EventStickyBar event={event} onBook={scrollToTickets} />

    </div>
  );
};

export default EventDetailsPage;
