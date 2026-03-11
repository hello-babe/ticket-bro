/**
 * EventRelatedSection.jsx
 * Related events grid
 * Production: GET /api/events/:slug/related
 * Uses BrowseEventCard for consistent card design
 */
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Calendar, MapPin, Star } from "lucide-react";
import Container from "@/components/layout/Container";
import { fmtDateShort } from "../shared/EventShared";
import { EVENTS_POOL } from "@/data/browseData";

const EventRelatedSection = ({ event }) => {
  // Production: use event.related from store (fetchRelatedEvents)
  const catSlug = event.category?.slug;
  const related = EVENTS_POOL.filter(
    (e) => e.category?.slug === catSlug && e.slug !== event.slug
  ).slice(0, 4);

  if (!related.length) return null;

  return (
    <div className="w-full border-t border-border" style={{ background: "var(--background)" }}>
      <Container>
        <div className="py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}>
              You Might Also Like
            </h2>
            {catSlug && (
              <Link to={`/${catSlug}`}
                className="flex items-center gap-1 text-xs font-semibold text-foreground hover:underline"
                style={{ fontFamily: "var(--font-sans)" }}>
                View all <ChevronRight size={13} />
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((e) => {
              const cat  = e.category?.slug  || catSlug;
              const sub  = e.subcategory?.slug || cat;
              const type = e.eventType?.slug   || sub;
              const href = `/${cat}/${sub}/${type}/${e.slug}`;

              return (
                <Link key={e._id} to={href}
                  className="group flex flex-col rounded-xl border border-border overflow-hidden hover:border-foreground/20 hover:shadow-md transition-all"
                  style={{ background: "var(--card)" }}>
                  <div className="h-40 overflow-hidden bg-muted shrink-0 relative">
                    <img src={e.coverImage} alt={e.title}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
                      onError={(ev) => { ev.target.style.opacity = "0.3"; }}
                    />
                    {e.isFeatured && (
                      <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: "var(--foreground)", color: "var(--background)", fontFamily: "var(--font-brand)" }}>
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="p-3 flex flex-col gap-1.5">
                    <h3 className="text-sm font-bold text-foreground line-clamp-2 group-hover:underline"
                      style={{ fontFamily: "var(--font-heading)" }}>{e.title}</h3>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1"
                      style={{ fontFamily: "var(--font-sans)" }}>
                      <Calendar size={10} />{fmtDateShort(e.startDate)}
                    </p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1 truncate"
                      style={{ fontFamily: "var(--font-sans)" }}>
                      <MapPin size={10} />{e.location?.name || e.location?.city}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-0.5">
                        <Star size={10} className="text-foreground fill-foreground" />
                        <span className="text-[11px] font-semibold text-foreground"
                          style={{ fontFamily: "var(--font-sans)" }}>
                          {(e.averageRating || 0).toFixed(1)}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-foreground"
                        style={{ fontFamily: "var(--font-heading)" }}>
                        {e.isFree ? "Free" : `৳${e.minPrice?.toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default EventRelatedSection;
