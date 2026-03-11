/**
 * BrowseEventCard.jsx
 * Uses Event model field names throughout:
 *   event.averageRating    (not rating)
 *   event.reviewCount
 *   event.organizer.isVerified  (not verified)
 *   event.totalCapacity / totalSold / totalReserved
 *   event.isFree / minPrice / maxPrice / currency
 *   event.priceLabel       (model virtual)
 *   event.spotsLeft        (model virtual)
 *   event.soldPercentage   (model virtual)
 *   event.location.name    (venue name)
 *   event.location.city
 *   event.startDate / endDate (ISO)
 *   event.category.slug / subcategory.slug / eventType.slug
 */
import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin, Calendar, Clock, Star, BadgeCheck,
  Bookmark, BookmarkCheck, Users,
} from "lucide-react";
import { spotsPercent, formatAttendees } from "@/hooks";

const fmtDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString("en-BD", { weekday:"short", month:"short", day:"numeric" });
  } catch { return iso || ""; }
};
const fmtTime = (iso) => {
  try {
    return new Date(iso).toLocaleTimeString("en-BD", { hour:"numeric", minute:"2-digit", hour12:true });
  } catch { return ""; }
};

/* ── Capacity Bar (uses model fields directly) ──────────────────── */
const CapacityBar = ({ event }) => {
  const pct = event.soldPercentage ?? spotsPercent(event);
  return (
    <div className="h-0.5 rounded-full bg-secondary overflow-hidden">
      <div className="h-full rounded-full transition-all"
        style={{ width:`${pct}%`, background: pct > 85 ? "var(--destructive)" : "var(--foreground)" }} />
    </div>
  );
};

/* ── Rating row ─────────────────────────────────────────────────── */
const RatingRow = ({ event, className = "" }) => (
  <div className={`flex items-center gap-0.5 ${className}`}>
    <Star size={11} className="text-foreground fill-foreground" />
    <span className="text-[11px] font-semibold text-foreground" style={{ fontFamily:"var(--font-sans)" }}>
      {(event.averageRating ?? 0).toFixed(1)}
    </span>
    <span className="text-[11px] text-muted-foreground" style={{ fontFamily:"var(--font-sans)" }}>
      ({event.reviewCount ?? 0})
    </span>
  </div>
);

/* ── Tag Pills ──────────────────────────────────────────────────── */
const TagPills = ({ tags = [], max = 2 }) => (
  <div className="flex gap-1 flex-wrap">
    {tags.slice(0, max).map((tag) => (
      <span key={tag._id ?? tag.name}
        className="text-[10px] font-medium px-1.5 py-0.5 rounded-full border"
        style={{ borderColor:"var(--border)", color:"var(--muted-foreground)", background:"var(--secondary)", fontFamily:"var(--font-sans)" }}>
        {tag.name}
      </span>
    ))}
  </div>
);

/* ── Save Button ─────────────────────────────────────────────────── */
const SaveBtn = ({ saved, onSave, eventId, dark = false }) => (
  <button onClick={(e) => { e.preventDefault(); onSave(eventId); }} aria-label={saved?"Unsave":"Save"}
    className={`flex items-center justify-center w-7 h-7 rounded-md border ${dark ? "border-white/20 bg-black/30 backdrop-blur-sm" : "border-border bg-background/70"} hover:opacity-80 transition-opacity`}>
    {saved
      ? <BookmarkCheck size={13} className={dark?"text-white":"text-foreground"} />
      : <Bookmark      size={13} className={dark?"text-white":"text-muted-foreground"} />}
  </button>
);

/* ── Event URL from model fields ─────────────────────────────────── */
const eventUrl = (e) =>
  `/${e.category?.slug}/${e.subcategory?.slug}/${e.eventType?.slug}/${e.slug}`;

/* ── GRID CARD ───────────────────────────────────────────────────── */
const CardGrid = ({ event: e, saved, onSave, showBadge }) => (
  <Link to={eventUrl(e)} className="group flex flex-col rounded-lg  bg-card overflow-hidden hover:border-foreground/20 hover:shadow-md transition-all">
    <div className="relative h-40 overflow-hidden bg-muted shrink-0">
      <img src={e.coverImage} alt={e.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" onError={(x)=>x.target.style.display="none"} />
      <div className="absolute top-2 right-2"><SaveBtn saved={saved} onSave={onSave} eventId={e.id} dark /></div>
      {e.isFree && <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded" style={{ background:"var(--foreground)",color:"var(--background)",fontFamily:"var(--font-brand)" }}>Free</span>}
      {showBadge && e.isTrending && <span className="absolute bottom-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm" style={{ background:"var(--foreground)",color:"var(--background)",fontFamily:"var(--font-sans)" }}>🔥 Trending</span>}
    </div>
    <div className="p-3 flex flex-col gap-2 flex-1">
      <TagPills tags={e.tags} />
      <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-2 group-hover:underline" style={{ fontFamily:"var(--font-heading)" }}>
        {e.title}{e.organizer?.isVerified && <BadgeCheck size={11} className="inline ml-1 text-foreground" />}
      </h3>
      <div className="space-y-0.5">
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground" style={{ fontFamily:"var(--font-sans)" }}>
          <Calendar size={10} className="shrink-0" />
          <span>{fmtDate(e.startDate)}</span>
          <span className="text-border">·</span>
          <Clock size={10} className="shrink-0" />
          <span>{fmtTime(e.startDate)}</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground" style={{ fontFamily:"var(--font-sans)" }}>
          <MapPin size={10} className="shrink-0" />
          <span className="truncate">{e.location?.name ?? e.location?.city}</span>
        </div>
      </div>
      <CapacityBar event={e} />
      <div className="flex items-center justify-between pt-1 border-t border-border mt-auto">
        <RatingRow event={e} />
        <span className="text-sm font-bold text-foreground" style={{ fontFamily:"var(--font-heading)" }}>{e.priceLabel}</span>
      </div>
    </div>
  </Link>
);

/* ── LIST CARD ───────────────────────────────────────────────────── */
const CardList = ({ event: e, saved, onSave }) => (
  <Link to={eventUrl(e)} className="group flex gap-3 rounded-lg  bg-card p-3 hover:border-foreground/20 hover:shadow-sm transition-all">
    <div className="relative w-24 h-24 rounded shrink-0 overflow-hidden bg-muted">
      <img src={e.coverImage} alt={e.title} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300" onError={(x)=>x.target.style.display="none"} />
      {e.isFree && <span className="absolute bottom-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background:"var(--foreground)",color:"var(--background)",fontFamily:"var(--font-brand)" }}>Free</span>}
    </div>
    <div className="flex-1 min-w-0 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-2 group-hover:underline" style={{ fontFamily:"var(--font-heading)" }}>
            {e.title}{e.organizer?.isVerified && <BadgeCheck size={11} className="inline ml-1" />}
          </h3>
          <SaveBtn saved={saved} onSave={onSave} eventId={e.id} />
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground mb-1.5" style={{ fontFamily:"var(--font-sans)" }}>
          <span className="flex items-center gap-1"><Calendar size={10} />{fmtDate(e.startDate)} · {fmtTime(e.startDate)}</span>
          <span className="flex items-center gap-1"><MapPin size={10} />{e.location?.name}</span>
        </div>
        <TagPills tags={e.tags} max={3} />
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <RatingRow event={e} />
          <div className="w-12 h-0.5 rounded-full bg-secondary overflow-hidden">
            <div className="h-full rounded-full" style={{ width:`${spotsPercent(e)}%`, background: spotsPercent(e)>85?"var(--destructive)":"var(--foreground)" }} />
          </div>
          <span className="text-[10px] text-muted-foreground" style={{ fontFamily:"var(--font-sans)" }}>
            {(e.spotsLeft ?? Math.max(0,e.totalCapacity-e.totalSold-(e.totalReserved||0)))} left
          </span>
        </div>
        <span className="text-sm font-bold text-foreground" style={{ fontFamily:"var(--font-heading)" }}>{e.priceLabel}</span>
      </div>
    </div>
  </Link>
);

/* ── FEATURED CARD ───────────────────────────────────────────────── */
const CardFeatured = ({ event: e, saved, onSave }) => (
  <Link to={eventUrl(e)} className="group relative rounded-lg overflow-hidden  hover:border-foreground/20 hover:shadow-lg transition-all aspect-[16/9]">
    <img src={e.coverImage} alt={e.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" onError={(x)=>x.target.style.display="none"} />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
    <div className="absolute top-3 right-3"><SaveBtn saved={saved} onSave={onSave} eventId={e.id} dark /></div>
    {e.isTrending && <span className="absolute top-3 left-3 text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background:"var(--foreground)",color:"var(--background)",fontFamily:"var(--font-sans)" }}>🔥 Trending</span>}
    <div className="absolute bottom-0 left-0 right-0 p-4">
      <TagPills tags={e.tags} max={2} />
      <h3 className="text-base font-bold text-white mt-1.5 line-clamp-2 group-hover:underline" style={{ fontFamily:"var(--font-heading)" }}>
        {e.title}{e.organizer?.isVerified && <BadgeCheck size={12} className="inline ml-1 text-white/80" />}
      </h3>
      <div className="flex items-center justify-between mt-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-white/80" style={{ fontFamily:"var(--font-sans)" }}>
          <span className="flex items-center gap-1"><Calendar size={10} />{fmtDate(e.startDate)}</span>
          <span className="flex items-center gap-1"><MapPin size={10} />{e.location?.name}</span>
          <span className="flex items-center gap-1"><Users size={10} />{formatAttendees(e.totalSold)} going</span>
        </div>
        <span className="text-sm font-bold text-white shrink-0" style={{ fontFamily:"var(--font-heading)" }}>{e.priceLabel}</span>
      </div>
    </div>
  </Link>
);

/* ── COMPACT CARD ────────────────────────────────────────────────── */
const CardCompact = ({ event: e, saved, onSave, showDistance, showReason }) => (
  <Link to={eventUrl(e)} className="group flex items-center gap-3 p-2.5 rounded-md  bg-card hover:border-foreground/20 hover:bg-accent/30 transition-all">
    <div className="relative w-14 h-14 rounded shrink-0 overflow-hidden bg-muted">
      <img src={e.coverImage} alt={e.title} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300" onError={(x)=>x.target.style.display="none"} />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-xs font-bold text-foreground leading-snug line-clamp-1 group-hover:underline" style={{ fontFamily:"var(--font-heading)" }}>{e.title}</h4>
      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground" style={{ fontFamily:"var(--font-sans)" }}>
        <span className="flex items-center gap-0.5"><Calendar size={9} />{fmtDate(e.startDate)}</span>
        {showDistance && e.location?.city && <span className="flex items-center gap-0.5"><MapPin size={9} />{e.location.city}</span>}
      </div>
    </div>
    <span className="text-xs font-bold text-foreground shrink-0" style={{ fontFamily:"var(--font-heading)" }}>{e.priceLabel}</span>
  </Link>
);

/* ── HORIZONTAL CARD ─────────────────────────────────────────────── */
const CardHorizontal = ({ event: e, saved, onSave, showBadge }) => (
  <Link to={eventUrl(e)} className="group flex gap-4 rounded-lg  bg-card p-3 hover:border-foreground/20 hover:shadow-sm transition-all">
    <div className="relative w-32 h-28 rounded shrink-0 overflow-hidden bg-muted">
      <img src={e.coverImage} alt={e.title} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300" onError={(x)=>x.target.style.display="none"} />
      {showBadge && e.isTrending && <span className="absolute bottom-1.5 left-1.5 text-[9px] font-semibold px-1.5 py-0.5 rounded" style={{ background:"var(--foreground)",color:"var(--background)",fontFamily:"var(--font-sans)" }}>🔥</span>}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <TagPills tags={e.tags} max={2} />
          <h3 className="text-sm font-bold text-foreground mt-1.5 line-clamp-2 group-hover:underline" style={{ fontFamily:"var(--font-heading)" }}>
            {e.title}{e.organizer?.isVerified && <BadgeCheck size={11} className="inline ml-1" />}
          </h3>
        </div>
        <SaveBtn saved={saved} onSave={onSave} eventId={e.id} />
      </div>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground mt-1.5" style={{ fontFamily:"var(--font-sans)" }}>
        <span className="flex items-center gap-1"><Calendar size={10} />{fmtDate(e.startDate)} · {fmtTime(e.startDate)}</span>
        <span className="flex items-center gap-1"><MapPin size={10} />{e.location?.name}</span>
      </div>
      <div className="flex items-center justify-between mt-2">
        <RatingRow event={e} />
        <span className="text-sm font-bold text-foreground" style={{ fontFamily:"var(--font-heading)" }}>{e.priceLabel}</span>
      </div>
    </div>
  </Link>
);

/* ── MAIN EXPORT ─────────────────────────────────────────────────── */
const BrowseEventCard = ({ event, variant="grid", saved=false, onSave=()=>{}, showBadge=false, showDistance=false, showReason=false }) => {
  const props = { event, saved, onSave, showBadge, showDistance, showReason };
  switch (variant) {
    case "list":       return <CardList       {...props} />;
    case "featured":   return <CardFeatured   {...props} />;
    case "compact":    return <CardCompact    {...props} />;
    case "horizontal": return <CardHorizontal {...props} />;
    default:           return <CardGrid       {...props} />;
  }
};

export default BrowseEventCard;
