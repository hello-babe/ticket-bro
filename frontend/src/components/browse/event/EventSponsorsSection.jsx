/**
 * EventSponsorsSection.jsx
 * Sponsor logos / tier display
 * Fields: event.sponsors[] (sponsorSchema): name, logo, url, tier
 */
import React from "react";
import { ExternalLink } from "lucide-react";
import { SectionHeading } from "./shared/EventShared.jsx";

const TIER_ORDER = ["platinum", "gold", "silver", "bronze", "partner"];
const TIER_LABEL = {
  platinum: "Platinum",
  gold: "Gold",
  silver: "Silver",
  bronze: "Bronze",
  partner: "Partners",
};

const EventSponsorsSection = ({ event }) => {
  const sponsors = event.sponsors || [];
  if (!sponsors.length) return null;

  const grouped = TIER_ORDER.reduce((acc, tier) => {
    const list = sponsors.filter((s) => s.tier === tier);
    if (list.length) acc[tier] = list;
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading>Sponsors</SectionHeading>
      {Object.entries(grouped).map(([tier, list]) => (
        <div key={tier}>
          <p
            className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {TIER_LABEL[tier] || tier}
          </p>
          <div className="flex flex-wrap gap-3">
            {list.map((s, i) => (
              <a
                key={s._id || i}
                href={s.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border hover:border-foreground/30 hover:shadow-sm transition-all"
                style={{ background: "var(--card)" }}
              >
                {s.logo ? (
                  <img
                    src={s.logo}
                    alt={s.name}
                    className="h-6 object-contain max-w-[80px]"
                  />
                ) : (
                  <span
                    className="text-sm font-bold text-foreground"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {s.name}
                  </span>
                )}
                <ExternalLink size={10} className="text-muted-foreground" />
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventSponsorsSection;
