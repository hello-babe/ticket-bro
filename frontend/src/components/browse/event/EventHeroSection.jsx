/**
 * EventHeroSection.jsx
 * Hero: full-bleed image gallery + event identity card
 * Fields: event.images[], coverImage, title, shortDescription,
 *         tags[], averageRating, reviewCount, isFeatured, isVerified,
 *         isTrending, status, startDate, endDate, location, organizer
 */
import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  Share2,
  Flag,
  BadgeCheck,
  Star,
  ZoomIn,
  Play,
  Calendar,
  Clock,
  MapPin,
  Users,
  Flame,
  Sparkles,
} from "lucide-react";
import Container from "@/components/layout/Container";
import {
  StarRow,
  TagPill,
  InfoRow,
  CapacityBar,
  AvatarCircle,
  PriceBadge,
  StatusBadge,
  fmtDate,
  fmtTime,
  fmtNum,
} from "./shared/EventShared.jsx";

const EventHeroSection = ({ event, saved, onSave, onShare, onBook }) => {
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const images = event.images?.length
    ? event.images
    : [event.coverImage].filter(Boolean);
  const prev = useCallback(
    () => setActiveImg((p) => (p - 1 + images.length) % images.length),
    [images.length],
  );
  const next = useCallback(
    () => setActiveImg((p) => (p + 1) % images.length),
    [images.length],
  );

  const organizer = event.organizerProfile || event.organizer;
  const orgName = organizer?.name || organizer?.username || "Organizer";
  const orgAvatar = (orgName[0] || "O").toUpperCase();
  const orgSlug = organizer?.slug || organizer?._id;

  return (
    <>
      {/* ── Full-bleed hero image ────────────────────────────────────── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "clamp(300px, 50vh, 560px)" }}
      >
        {/* Background blur layer */}
        <div
          className="absolute inset-0 scale-110"
          style={{
            backgroundImage: `url(${images[activeImg]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(24px) brightness(0.3)",
          }}
        />

        {/* Main image */}
        <img
          key={images[activeImg]}
          src={images[activeImg]}
          alt={event.title}
          className="relative w-full h-full object-contain"
          style={{ animation: "fadeIn 0.3s ease" }}
          onError={(e) => {
            e.target.style.opacity = "0.3";
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Top action bar */}
        <div className="absolute top-0 left-0 right-0 flex items-start justify-between p-4 sm:p-6">
          <div className="flex gap-1.5 flex-wrap">
            <StatusBadge status={event.status} />
            {event.isFeatured && (
              <span
                className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                style={{
                  background: "rgba(163,230,53,0.15)",
                  borderColor: "rgba(163,230,53,0.4)",
                  color: "#a3e635",
                }}
              >
                <Sparkles size={9} /> Featured
              </span>
            )}
            {event.isTrending && (
              <span
                className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                style={{
                  background: "rgba(251,191,36,0.15)",
                  borderColor: "rgba(251,191,36,0.4)",
                  color: "#fbbf24",
                }}
              >
                <Flame size={9} /> Trending
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onSave}
              aria-label="Save"
              className="w-9 h-9 rounded-full flex items-center justify-center border border-white/20 bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all"
            >
              {saved ? (
                <BookmarkCheck size={15} className="text-lime-400" />
              ) : (
                <Bookmark size={15} className="text-white" />
              )}
            </button>
            <button
              onClick={onShare}
              aria-label="Share"
              className="w-9 h-9 rounded-full flex items-center justify-center border border-white/20 bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all"
            >
              <Share2 size={15} className="text-white" />
            </button>
            <button
              onClick={() => setLightbox(true)}
              aria-label="Zoom"
              className="w-9 h-9 rounded-full flex items-center justify-center border border-white/20 bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all"
            >
              <ZoomIn size={15} className="text-white" />
            </button>
          </div>
        </div>

        {/* Gallery nav arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center border border-white/20 bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all"
            >
              <ChevronLeft size={18} className="text-white" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center border border-white/20 bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all"
            >
              <ChevronRight size={18} className="text-white" />
            </button>
          </>
        )}

        {/* Bottom info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Tags */}
                <div className="flex gap-1.5 flex-wrap mb-2">
                  {(event.tags || []).slice(0, 4).map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{
                        background: "rgba(255,255,255,0.15)",
                        color: "rgba(255,255,255,0.9)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      {tag.name || tag}
                    </span>
                  ))}
                </div>
                {/* Title */}
                <h1
                  className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-1"
                  style={{
                    fontFamily: "var(--font-heading)",
                    textShadow: "0 2px 8px rgba(0,0,0,0.4)",
                  }}
                >
                  {event.title}
                  {event.isVerified && (
                    <BadgeCheck
                      size={22}
                      className="inline ml-2 text-lime-400"
                    />
                  )}
                </h1>
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <StarRow rating={event.averageRating} size={13} />
                  <span className="text-sm font-bold text-white">
                    {(event.averageRating || 0).toFixed(1)}
                  </span>
                  <span className="text-sm text-white/70">
                    ({fmtNum(event.reviewCount)} reviews)
                  </span>
                </div>
              </div>
              {/* Image counter */}
              {images.length > 1 && (
                <div className="flex gap-1 shrink-0">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className="rounded-full transition-all"
                      style={{
                        width: i === activeImg ? 20 : 6,
                        height: 6,
                        background:
                          i === activeImg
                            ? "var(--color-brand-primary, #a3e635)"
                            : "rgba(255,255,255,0.4)",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </Container>
        </div>
      </div>

      {/* ── Info strip ───────────────────────────────────────────────── */}
      <div
        className="border-b border-border"
        style={{ background: "var(--card)" }}
      >
        <Container>
          <div className="py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Date */}
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center border border-border shrink-0"
                style={{ background: "var(--secondary)" }}
              >
                <Calendar size={15} className="text-foreground" />
              </div>
              <div>
                <p
                  className="text-[10px] text-muted-foreground uppercase tracking-wide"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Date
                </p>
                <p
                  className="text-xs font-semibold text-foreground leading-tight"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {fmtDate(event.startDate)}
                </p>
              </div>
            </div>
            {/* Time */}
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center border border-border shrink-0"
                style={{ background: "var(--secondary)" }}
              >
                <Clock size={15} className="text-foreground" />
              </div>
              <div>
                <p
                  className="text-[10px] text-muted-foreground uppercase tracking-wide"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Time
                </p>
                <p
                  className="text-xs font-semibold text-foreground leading-tight"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {fmtTime(event.startDate)} – {fmtTime(event.endDate)}
                </p>
              </div>
            </div>
            {/* Venue */}
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center border border-border shrink-0"
                style={{ background: "var(--secondary)" }}
              >
                <MapPin size={15} className="text-foreground" />
              </div>
              <div className="min-w-0">
                <p
                  className="text-[10px] text-muted-foreground uppercase tracking-wide"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Venue
                </p>
                <p
                  className="text-xs font-semibold text-foreground leading-tight truncate"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {event.location?.name || event.location?.city || "TBA"}
                </p>
              </div>
            </div>
            {/* Attendance */}
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center border border-border shrink-0"
                style={{ background: "var(--secondary)" }}
              >
                <Users size={15} className="text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-[10px] text-muted-foreground uppercase tracking-wide"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Attending
                </p>
                <p
                  className="text-xs font-semibold text-foreground leading-tight"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {fmtNum(event.totalSold)} / {fmtNum(event.totalCapacity)}
                </p>
                <CapacityBar
                  soldPercentage={event.soldPercentage}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95"
          onClick={() => setLightbox(false)}
        >
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center border border-white/20 bg-white/10 hover:bg-white/20"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          <img
            src={images[activeImg]}
            alt=""
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center border border-white/20 bg-white/10 hover:bg-white/20"
          >
            <ChevronRight size={20} className="text-white" />
          </button>
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-sm font-medium"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            ✕ Close
          </button>
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {activeImg + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
};

export default EventHeroSection;
