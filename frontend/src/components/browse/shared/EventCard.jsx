// frontend/src/components/browse/shared/EventCard.jsx
// Single unified EventCard component.
//
// Usage:
//   <EventCard variant="grid"     event={event} saved={saved} onSave={onSave} />
//   <EventCard variant="list"     event={event} saved={saved} onSave={onSave} />
//   <EventCard variant="featured" event={event} saved={saved} onSave={onSave} badge="Featured" />
//   <EventCard variant="compact"  event={event} saved={saved} onSave={onSave} />
//
// Variants:
//   grid     — standard card with image on top, used in grids
//   list     — horizontal card, used in list/table views
//   featured — large card with tall image and gradient, used as hero card
//   compact  — small horizontal thumbnail card, used in sidebars / small lists

import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin, Calendar, Clock,
  Star, Bookmark, BookmarkCheck,
  Ticket, BadgeCheck,
} from "lucide-react";
import { spotsPercent, buildEventUrl } from "@/utils/browse/browseUtils";

/* ─── Internal sub-components ─────────────────────────────── */

const CapacityBar = ({ attendees, capacity, height = "h-0.5" }) => {
  const pct = spotsPercent(attendees, capacity);
  return (
    <div className={`${height} rounded-full bg-secondary overflow-hidden`}>
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{
          width: `${pct}%`,
          background: pct > 85 ? "var(--destructive)" : "var(--foreground)",
        }}
      />
    </div>
  );
};

export const StarRow = ({ rating, size = 11 }) => (
  <span className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        size={size}
        className={rating >= i ? "text-foreground fill-foreground" : "text-border"}
      />
    ))}
  </span>
);

const TagChip = ({ label }) => (
  <span
    className="text-[10px] font-medium px-1.5 py-0.5 rounded-full border"
    style={{
      borderColor: "var(--border)",
      color: "var(--muted-foreground)",
      background: "var(--secondary)",
      fontFamily: "var(--font-sans)",
    }}
  >
    {label}
  </span>
);

const SaveButton = ({ saved, onSave, className = "" }) => (
  <button
    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSave?.(); }}
    className={`flex items-center justify-center transition-colors ${className}`}
    aria-label={saved ? "Unsave event" : "Save event"}
  >
    {saved
      ? <BookmarkCheck size={13} className="text-foreground" />
      : <Bookmark size={13} className="text-muted-foreground hover:text-foreground" />}
  </button>
);

const RatingLine = ({ rating, reviewCount, size = 11 }) => (
  <div className="flex items-center gap-0.5">
    <StarRow rating={rating} size={size} />
    <span className="text-[11px] font-semibold text-foreground ml-1" style={{ fontFamily: "var(--font-sans)" }}>
      {rating > 0 ? rating : "New"}
    </span>
    {reviewCount > 0 && (
      <span className="text-[11px] text-muted-foreground" style={{ fontFamily: "var(--font-sans)" }}>
        ({reviewCount})
      </span>
    )}
  </div>
);

const AttendeeCount = ({ attendees }) => {
  const fmt = attendees >= 1000 ? `${(attendees / 1000).toFixed(1)}k` : String(attendees);
  return <span className="font-semibold text-foreground">{fmt}</span>;
};

/* ─── Variant renderers ────────────────────────────────────── */

const GridCard = ({ event, saved, onSave }) => (
  <Link
    to={buildEventUrl(event)}
    className="group flex flex-col rounded-lg border border-border bg-card overflow-hidden hover:border-foreground/20 hover:shadow-md transition-all duration-200"
  >
    {/* Image */}
    <div className="relative h-40 overflow-hidden bg-muted shrink-0">
      <img src={event.image} alt={event.title}
        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
        onError={(e) => { e.target.style.display = "none"; }}
      />
      <div className="absolute top-2 right-2 w-7 h-7 rounded-md flex items-center justify-center border border-white/20 bg-black/30 backdrop-blur-sm">
        <SaveButton saved={saved} onSave={() => onSave?.(event.id)} className="text-white" />
      </div>
      {event.price === 0 && (
        <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded"
          style={{ background: "var(--foreground)", color: "var(--background)", fontFamily: "var(--font-brand)" }}>
          Free
        </span>
      )}
    </div>

    {/* Body */}
    <div className="p-3 flex flex-col gap-2 flex-1">
      <div className="flex gap-1 flex-wrap">
        {event.tags?.slice(0, 2).map((tag) => <TagChip key={tag} label={tag} />)}
      </div>

      <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-2 group-hover:underline"
        style={{ fontFamily: "var(--font-heading)" }}>
        {event.title}
        {event.verified && <BadgeCheck size={11} className="inline ml-1 text-foreground" />}
      </h3>

      <div className="flex flex-col gap-1 text-[11px] text-muted-foreground" style={{ fontFamily: "var(--font-sans)" }}>
        <div className="flex items-center gap-1">
          <Calendar size={10} className="shrink-0" /><span>{event.date}</span>
          <span className="text-border">·</span>
          <Clock size={10} className="shrink-0" /><span>{event.time}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin size={10} className="shrink-0" /><span className="truncate">{event.venue}</span>
        </div>
      </div>

      <CapacityBar attendees={event.attendees} capacity={event.capacity} />

      <div className="flex items-center justify-between pt-1 border-t border-border mt-auto">
        <RatingLine rating={event.rating} reviewCount={event.reviewCount} />
        <span className="text-sm font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
          {event.priceLabel}
        </span>
      </div>
    </div>
  </Link>
);

const ListCard = ({ event, saved, onSave }) => {
  const pct = spotsPercent(event.attendees, event.capacity);
  return (
    <Link
      to={buildEventUrl(event)}
      className="group flex gap-3 rounded-lg border border-border bg-card p-3 hover:border-foreground/20 hover:shadow-sm transition-all duration-200"
    >
      <div className="relative w-24 h-24 rounded shrink-0 overflow-hidden bg-muted">
        <img src={event.image} alt={event.title}
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
          onError={(e) => { e.target.style.display = "none"; }}
        />
        {event.price === 0 && (
          <span className="absolute bottom-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded"
            style={{ background: "var(--foreground)", color: "var(--background)", fontFamily: "var(--font-brand)" }}>Free</span>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-2 group-hover:underline"
              style={{ fontFamily: "var(--font-heading)" }}>
              {event.title}
              {event.verified && <BadgeCheck size={11} className="inline ml-1 text-foreground" />}
            </h3>
            <SaveButton saved={saved} onSave={() => onSave?.(event.id)} className="shrink-0" />
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground" style={{ fontFamily: "var(--font-sans)" }}>
            <span className="flex items-center gap-1"><Calendar size={10} />{event.date} · {event.time}</span>
            <span className="flex items-center gap-1"><MapPin size={10} />{event.venue}</span>
          </div>
          <div className="flex gap-1 mt-1.5 flex-wrap">
            {event.tags?.slice(0, 3).map((tag) => <TagChip key={tag} label={tag} />)}
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <RatingLine rating={event.rating} reviewCount={0} size={10} />
            <div className="w-12 h-0.5 rounded-full bg-secondary overflow-hidden">
              <div className="h-full rounded-full"
                style={{ width: `${pct}%`, background: pct > 85 ? "var(--destructive)" : "var(--foreground)" }} />
            </div>
            <span className="text-[10px] text-muted-foreground" style={{ fontFamily: "var(--font-sans)" }}>{event.spotsLeft} left</span>
          </div>
          <span className="text-sm font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>{event.priceLabel}</span>
        </div>
      </div>
    </Link>
  );
};

const FeaturedCard = ({ event, saved, onSave, badge = "Featured" }) => {
  const pct = spotsPercent(event.attendees, event.capacity);
  return (
    <Link
      to={buildEventUrl(event)}
      className="group relative flex flex-col rounded-lg border border-border bg-card overflow-hidden hover:border-foreground/20 hover:shadow-md transition-all duration-200"
    >
      <div className="relative h-52 sm:h-64 overflow-hidden bg-muted">
        <img src={event.image} alt={event.title}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          onError={(e) => { e.target.style.display = "none"; }}
        />
        {badge && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
              style={{ background: "var(--foreground)", color: "var(--background)", fontFamily: "var(--font-brand)" }}>
              {badge}
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3 w-7 h-7 rounded-md flex items-center justify-center border border-white/20 bg-black/30 backdrop-blur-sm">
          <SaveButton saved={saved} onSave={() => onSave?.(event.id)} className="text-white" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex gap-1.5 flex-wrap">
          {event.tags?.slice(0, 3).map((tag) => <TagChip key={tag} label={tag} />)}
        </div>

        <div>
          <div className="flex items-start gap-1.5 mb-1">
            <h3 className="text-base font-bold text-foreground leading-snug group-hover:underline"
              style={{ fontFamily: "var(--font-heading)" }}>{event.title}</h3>
            {event.verified && <BadgeCheck size={14} className="text-foreground shrink-0 mt-0.5" />}
          </div>
          <p className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-sans)" }}>by {event.organizer}</p>
        </div>

        <div className="flex flex-col gap-1.5 text-xs text-muted-foreground" style={{ fontFamily: "var(--font-sans)" }}>
          <div className="flex items-center gap-1.5"><Calendar size={12} />{event.date} · {event.time}</div>
          <div className="flex items-center gap-1.5"><MapPin size={12} /><span className="truncate">{event.venue}</span></div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1 text-[10px] text-muted-foreground" style={{ fontFamily: "var(--font-sans)" }}>
            <span><AttendeeCount attendees={event.attendees} /> attending</span>
            <span>{event.spotsLeft} spots left</span>
          </div>
          <CapacityBar attendees={event.attendees} capacity={event.capacity} height="h-1" />
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-border mt-auto">
          <RatingLine rating={event.rating} reviewCount={event.reviewCount} size={12} />
          <div className="flex items-center gap-1.5">
            <Ticket size={12} className="text-muted-foreground" />
            <span className="text-sm font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>{event.priceLabel}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const CompactCard = ({ event, saved, onSave }) => {
  const pct = spotsPercent(event.attendees, event.capacity);
  return (
    <Link
      to={buildEventUrl(event)}
      className="group flex gap-3 rounded-lg border border-border bg-card p-3 hover:border-foreground/20 hover:shadow-sm transition-all duration-200"
    >
      <div className="w-20 h-20 rounded shrink-0 overflow-hidden bg-muted">
        <img src={event.image} alt={event.title}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          onError={(e) => { e.target.style.display = "none"; }}
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-2 group-hover:underline"
              style={{ fontFamily: "var(--font-heading)" }}>
              {event.title}
              {event.verified && <BadgeCheck size={12} className="inline ml-1 text-foreground" />}
            </h3>
            <SaveButton saved={saved} onSave={() => onSave?.(event.id)} className="shrink-0 mt-0.5" />
          </div>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground mb-1" style={{ fontFamily: "var(--font-sans)" }}>
            <Calendar size={10} />{event.date} · {event.time}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground" style={{ fontFamily: "var(--font-sans)" }}>
            <MapPin size={10} /><span className="truncate">{event.venue}</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <Star size={11} className="text-foreground fill-foreground" />
            <span className="text-[11px] font-semibold text-foreground" style={{ fontFamily: "var(--font-sans)" }}>
              {event.rating > 0 ? event.rating : "New"}
            </span>
          </div>
          <span className="text-sm font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>{event.priceLabel}</span>
        </div>
        <CapacityBar attendees={event.attendees} capacity={event.capacity} className="mt-1.5" />
      </div>
    </Link>
  );
};

/* ─── VARIANT MAP ──────────────────────────────────────────── */

const VARIANTS = {
  grid:     GridCard,
  list:     ListCard,
  featured: FeaturedCard,
  compact:  CompactCard,
};

/* ─── MAIN EXPORT ──────────────────────────────────────────── */

/**
 * EventCard — unified card component for all browse sections.
 *
 * @param {string}   variant  - "grid" | "list" | "featured" | "compact"
 * @param {object}   event    - event data object
 * @param {boolean}  saved    - whether the event is bookmarked
 * @param {function} onSave   - called with event.id when save button clicked
 * @param {string}   badge    - (featured only) badge label, default "Featured"
 */
const EventCard = ({ variant = "grid", event, saved, onSave, badge }) => {
  const Card = VARIANTS[variant] ?? GridCard;
  return <Card event={event} saved={saved} onSave={onSave} badge={badge} />;
};

export default EventCard;

/* ─── EMPTY STATE ──────────────────────────────────────────── */

export const EventEmptyState = ({ locationLabel, levelLabel, message }) => (
  <div className="flex flex-col items-center justify-center py-16 rounded-lg border border-dashed border-border text-center">
    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 border border-border"
      style={{ background: "var(--secondary)" }}>
      <Ticket size={20} className="text-muted-foreground" />
    </div>
    <p className="text-sm font-semibold text-foreground mb-1" style={{ fontFamily: "var(--font-heading)" }}>
      {message || `No ${levelLabel ? `${levelLabel} ` : ""}events found in ${locationLabel || "your city"}`}
    </p>
    <p className="text-xs text-muted-foreground max-w-xs" style={{ fontFamily: "var(--font-sans)" }}>
      Try adjusting your filters or changing your location.
    </p>
  </div>
);
