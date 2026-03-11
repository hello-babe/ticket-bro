/**
 * EventAgendaSection.jsx
 * Schedule / agenda timeline
 * Fields: event.agenda[] (agendaItemSchema: title, startTime, endTime, speaker, location, description)
 *         Also accepts event.schedule[] for UI-only mock data
 */
import React, { useState } from "react";
import { Clock, MapPin, User, ChevronDown } from "lucide-react";
import { SectionHeading, fmtTime } from "../shared/EventShared";

const EventAgendaSection = ({ event }) => {
  const [openIdx, setOpenIdx] = useState(null);

  // Prefer real agenda (model field), fall back to UI mock
  const items = (event.agenda?.length ? event.agenda : event.schedule || []);
  if (!items.length) return null;

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading>Schedule</SectionHeading>

      <div className="relative">
        {/* Vertical timeline rail */}
        <div className="absolute left-[22px] top-3 bottom-3 w-px" style={{ background: "var(--border)" }} />

        <div className="flex flex-col gap-0">
          {items.map((item, i) => {
            const isOpen = openIdx === i;
            const time   = item.startTime ? fmtTime(item.startTime) : item.time;
            const hasDetail = item.description || item.speaker || item.location;

            return (
              <div key={item._id || i} className="flex gap-4 group">
                {/* Dot + line */}
                <div className="flex flex-col items-center shrink-0 pt-3" style={{ width: 46 }}>
                  <div className="w-3 h-3 rounded-full border-2 transition-colors relative z-10"
                    style={{
                      borderColor: i === 0 ? "var(--foreground)" : "var(--border)",
                      background: i === 0 ? "var(--foreground)" : "var(--background)",
                    }}
                  />
                </div>

                {/* Content card */}
                <div className="flex-1 pb-4">
                  <button
                    onClick={() => hasDetail && setOpenIdx(isOpen ? null : i)}
                    className={`w-full flex items-start justify-between gap-3 p-3 rounded-xl border text-left transition-all ${hasDetail ? "hover:border-foreground/20 cursor-pointer" : "cursor-default"}`}
                    style={{
                      borderColor: isOpen ? "var(--foreground)" : "var(--border)",
                      background: isOpen ? "var(--secondary)" : "var(--card)",
                    }}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-foreground"
                          style={{ fontFamily: "var(--font-heading)" }}>
                          {item.title}
                        </p>
                        {time && (
                          <span className="flex items-center gap-1 text-[11px] text-muted-foreground"
                            style={{ fontFamily: "var(--font-sans)" }}>
                            <Clock size={10} />{time}
                          </span>
                        )}
                      </div>
                      {/* Expanded detail */}
                      {isOpen && (
                        <div className="mt-2 flex flex-col gap-1">
                          {item.description && (
                            <p className="text-xs text-muted-foreground leading-relaxed"
                              style={{ fontFamily: "var(--font-sans)" }}>{item.description}</p>
                          )}
                          {item.speaker && (
                            <p className="flex items-center gap-1 text-xs text-muted-foreground"
                              style={{ fontFamily: "var(--font-sans)" }}>
                              <User size={10} />{item.speaker}
                            </p>
                          )}
                          {item.location && (
                            <p className="flex items-center gap-1 text-xs text-muted-foreground"
                              style={{ fontFamily: "var(--font-sans)" }}>
                              <MapPin size={10} />{item.location}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    {hasDetail && (
                      <ChevronDown size={13} className={`text-muted-foreground shrink-0 transition-transform mt-0.5 ${isOpen ? "rotate-180" : ""}`} />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EventAgendaSection;
