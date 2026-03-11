/**
 * EventLineupSection.jsx
 * Performer / artist lineup display
 * Fields: event.lineup[] (UI-only — production: fetch from artist API)
 *         Uses event.category.slug to determine label ("Lineup", "Speakers", etc.)
 */
import React, { useState } from "react";
import { Clock, Music, Mic, Users } from "lucide-react";
import { SectionHeading, AvatarCircle } from "../shared/EventShared";

const ROLE_ORDER = ["Headliner", "Co-Headliner", "Special Guest", "Supporting", "Opening Act"];

const EventLineupSection = ({ event }) => {
  const [expanded, setExpanded] = useState(false);
  const lineup = event.lineup || [];
  if (!lineup.length) return null;

  const sorted  = [...lineup].sort((a, b) =>
    ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role)
  );
  const visible = expanded ? sorted : sorted.slice(0, 5);

  const catSlug  = event.category?.slug;
  const heading  = catSlug === "business" || catSlug === "education" ? "Speakers" : "Lineup";

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading>
        {heading}
        <span className="ml-2 text-sm font-normal text-muted-foreground">{lineup.length} artists</span>
      </SectionHeading>

      <div className="flex flex-col gap-2">
        {visible.map((artist, i) => (
          <div key={artist.id || i}
            className="group flex items-center gap-3 p-3 rounded-xl border border-border hover:border-foreground/20 hover:shadow-sm transition-all"
            style={{ background: "var(--card)" }}>

            {/* Avatar / image */}
            <div className="w-12 h-12 rounded-full overflow-hidden bg-muted shrink-0 border border-border">
              {artist.image
                ? <img src={artist.image} alt={artist.name} className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = "none"; }} />
                : <AvatarCircle initial={artist.avatar || artist.name[0]} size={3} className="w-full h-full rounded-full" />
              }
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-bold text-foreground"
                  style={{ fontFamily: "var(--font-heading)" }}>{artist.name}</p>
                {/* Role badge — headliner gets lime accent */}
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: i === 0 ? "var(--foreground)" : "var(--secondary)",
                    color:      i === 0 ? "var(--background)" : "var(--muted-foreground)",
                    fontFamily: "var(--font-brand)",
                  }}>
                  {artist.role}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5"
                style={{ fontFamily: "var(--font-sans)" }}>{artist.genre}</p>
            </div>

            {/* Time */}
            {artist.time && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0"
                style={{ fontFamily: "var(--font-sans)" }}>
                <Clock size={11} />
                {artist.time}
              </div>
            )}
          </div>
        ))}
      </div>

      {lineup.length > 5 && (
        <button onClick={() => setExpanded((p) => !p)}
          className="text-xs font-semibold text-foreground hover:opacity-70 transition-opacity self-start underline underline-offset-2"
          style={{ fontFamily: "var(--font-sans)" }}>
          {expanded ? "Show less" : `View all ${lineup.length} artists`}
        </button>
      )}
    </div>
  );
};

export default EventLineupSection;
