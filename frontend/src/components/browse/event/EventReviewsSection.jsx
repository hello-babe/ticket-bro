/**
 * EventReviewsSection.jsx
 * User reviews with rating breakdown, pagination, helpful voting
 * Fields: event.averageRating, event.reviewCount
 * Production: GET /api/events/:slug/reviews?page=1&limit=5&sort=-helpful
 */
import React, { useState } from "react";
import { Star, BadgeCheck, ThumbsUp, ChevronDown } from "lucide-react";
import {
  SectionHeading,
  StarRow,
  AvatarCircle,
  timeAgo,
} from "./shared/EventShared.jsx";

const MOCK_REVIEWS = [
  {
    id: 1,
    author: "Rafiq Ahmed",
    initial: "R",
    averageRating: 5,
    title: "Best concert I've attended!",
    body: "Absolutely electric atmosphere. Arbovirus were phenomenal as always and the production quality was insane. Worth every taka.",
    helpful: 47,
    verified: true,
    createdAt: "2025-03-01T10:00:00Z",
  },
  {
    id: 2,
    author: "Nadia Khan",
    initial: "N",
    averageRating: 5,
    title: "Unforgettable night",
    body: "The sound system was world class. Every band delivered. I cried during Shironamhin's set. Already have tickets for next year.",
    helpful: 34,
    verified: true,
    createdAt: "2025-02-28T14:30:00Z",
  },
  {
    id: 3,
    author: "Imran Hossain",
    initial: "I",
    averageRating: 4,
    title: "Great event, minor issues",
    body: "Amazing performances all around. Entry queues were a bit slow but once inside it was absolutely perfect. Would come again.",
    helpful: 21,
    verified: false,
    createdAt: "2025-02-26T19:00:00Z",
  },
  {
    id: 4,
    author: "Sadia Islam",
    initial: "S",
    averageRating: 5,
    title: "Pure rock bliss",
    body: "The energy was beyond words. Cryptic Fate stole the show for me. The stage production was on another level for Bangladesh.",
    helpful: 18,
    verified: true,
    createdAt: "2025-02-25T08:00:00Z",
  },
  {
    id: 5,
    author: "Tanvir Alam",
    initial: "T",
    averageRating: 4,
    title: "Loved it",
    body: "Great lineup, great crowd. A few technical hiccups early on but they sorted it quickly. Overall a massive success.",
    helpful: 12,
    verified: false,
    createdAt: "2025-02-24T12:00:00Z",
  },
];

const RATING_DIST = [
  { stars: 5, pct: 78 },
  { stars: 4, pct: 14 },
  { stars: 3, pct: 5 },
  { stars: 2, pct: 2 },
  { stars: 1, pct: 1 },
];

const EventReviewsSection = ({ event }) => {
  const [helpfulSet, setHelpfulSet] = useState(new Set());
  const [showAll, setShowAll] = useState(false);

  const reviews = MOCK_REVIEWS;
  const visible = showAll ? reviews : reviews.slice(0, 3);
  const rating = event.averageRating || 4.9;
  const total = event.reviewCount || 312;

  const toggle = (id) =>
    setHelpfulSet((p) => {
      const n = new Set(p);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading>
        Reviews
        <span className="text-sm font-normal text-muted-foreground ml-1">
          ({total.toLocaleString()})
        </span>
      </SectionHeading>

      {/* Rating summary */}
      <div
        className="flex gap-6 p-5 rounded-2xl border border-border"
        style={{ background: "var(--card)" }}
      >
        {/* Big number */}
        <div className="flex flex-col items-center justify-center shrink-0 gap-1">
          <p
            className="text-5xl font-extrabold text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {rating.toFixed(1)}
          </p>
          <StarRow rating={rating} size={13} />
          <p
            className="text-[11px] text-muted-foreground"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {total.toLocaleString()} reviews
          </p>
        </div>
        {/* Bars */}
        <div className="flex-1 flex flex-col gap-1.5 justify-center">
          {RATING_DIST.map(({ stars, pct }) => (
            <div key={stars} className="flex items-center gap-2">
              <span
                className="text-[11px] font-medium text-foreground w-2 shrink-0"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {stars}
              </span>
              <Star
                size={9}
                className="text-foreground fill-foreground shrink-0"
              />
              <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: "var(--foreground)" }}
                />
              </div>
              <span
                className="text-[11px] text-muted-foreground w-7 text-right shrink-0"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Review cards */}
      <div className="flex flex-col gap-3">
        {visible.map((r) => (
          <div
            key={r.id}
            className="p-4 rounded-xl border border-border"
            style={{ background: "var(--card)" }}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <AvatarCircle initial={r.initial} size={2.5} />
                <div>
                  <div className="flex items-center gap-1">
                    <p
                      className="text-xs font-semibold text-foreground"
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      {r.author}
                    </p>
                    {r.verified && (
                      <BadgeCheck size={11} className="text-foreground" />
                    )}
                  </div>
                  <p
                    className="text-[10px] text-muted-foreground"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {timeAgo(r.createdAt)}
                  </p>
                </div>
              </div>
              <StarRow rating={r.averageRating} size={11} />
            </div>
            <p
              className="text-xs font-bold text-foreground mb-1"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {r.title}
            </p>
            <p
              className="text-xs text-muted-foreground leading-relaxed"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {r.body}
            </p>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <span
                className="text-[10px] text-muted-foreground"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Helpful?
              </span>
              <button
                onClick={() => toggle(r.id)}
                className="flex items-center gap-1.5 text-[11px] transition-colors"
                style={{
                  color: helpfulSet.has(r.id)
                    ? "var(--foreground)"
                    : "var(--muted-foreground)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                <ThumbsUp
                  size={11}
                  className={helpfulSet.has(r.id) ? "fill-foreground" : ""}
                />
                {r.helpful + (helpfulSet.has(r.id) ? 1 : 0)}
              </button>
            </div>
          </div>
        ))}
      </div>

      {reviews.length > 3 && (
        <button
          onClick={() => setShowAll((p) => !p)}
          className="flex items-center gap-1.5 text-xs font-semibold text-foreground hover:opacity-70 transition-opacity self-start underline underline-offset-2"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          <ChevronDown
            size={12}
            className={
              showAll
                ? "rotate-180 transition-transform"
                : "transition-transform"
            }
          />
          {showAll
            ? "Show fewer reviews"
            : `View all ${total.toLocaleString()} reviews`}
        </button>
      )}
    </div>
  );
};

export default EventReviewsSection;
