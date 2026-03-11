/**
 * EventVenueSection.jsx
 * Venue details + embedded map
 * Fields: event.location (locationSchema): name, address, city, state, country,
 *         coordinates.coordinates [lng,lat], onlineUrl, onlinePlatform, streamPassword
 */
import React, { useState } from "react";
import {
  MapPin,
  Navigation,
  Copy,
  ExternalLink,
  Wifi,
  Globe,
  Check,
  Info,
} from "lucide-react";
import { SectionHeading, InfoRow } from "./shared/EventShared.jsx";

const EventVenueSection = ({ event }) => {
  const [copied, setCopied] = useState(false);
  const loc = event.location || {};

  const isOnline = loc.isOnline || loc.type === "online";
  const isHybrid = loc.isHybrid || loc.type === "hybrid";
  const latLng = loc.latLng;
  const address =
    loc.addressLabel ||
    [loc.name, loc.address, loc.city, loc.country].filter(Boolean).join(", ");
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
  const embedUrl = latLng
    ? `https://maps.google.com/maps?q=${latLng.lat},${latLng.lng}&z=15&output=embed`
    : `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  const copyAddress = () => {
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading>
        {isOnline ? "Online Event" : "Venue"}
        <span className="text-xs font-normal text-muted-foreground">
          {loc.typeLabel ||
            (isOnline ? "Online" : isHybrid ? "Hybrid" : "In Person")}
        </span>
      </SectionHeading>

      {/* Online details */}
      {isOnline && (
        <div
          className="p-4 rounded-xl border border-border flex flex-col gap-3"
          style={{ background: "var(--card)" }}
        >
          <div className="flex items-center gap-2.5">
            <Wifi size={18} className="text-foreground" />
            <div>
              <p
                className="text-sm font-bold text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {loc.onlinePlatform || "Online"}
              </p>
              <p
                className="text-xs text-muted-foreground"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Link will be sent after ticket purchase
              </p>
            </div>
          </div>
          {loc.onlineUrl && (
            <a
              href={loc.onlineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-foreground hover:underline"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <Globe size={12} />
              Join Event Link <ExternalLink size={11} />
            </a>
          )}
        </div>
      )}

      {/* Physical map */}
      {!isOnline && (
        <>
          <div
            className="rounded-xl overflow-hidden border border-border bg-muted"
            style={{ height: 240 }}
          >
            <iframe
              title="Event venue"
              src={embedUrl}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div
            className="flex flex-col gap-3 p-4 rounded-xl border border-border"
            style={{ background: "var(--card)" }}
          >
            <div>
              <p
                className="text-sm font-bold text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {loc.name || "Venue"}
              </p>
              <p
                className="text-xs text-muted-foreground mt-0.5"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {address}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-border hover:bg-accent transition-colors"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <Navigation size={11} /> Get Directions
              </a>
              <button
                onClick={copyAddress}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-border hover:bg-accent transition-colors"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {copied ? (
                  <>
                    <Check size={11} className="text-foreground" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy size={11} /> Copy Address
                  </>
                )}
              </button>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Open in Maps <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EventVenueSection;
