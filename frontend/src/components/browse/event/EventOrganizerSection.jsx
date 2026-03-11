/**
 * EventOrganizerSection.jsx
 * Organizer profile card
 * Fields: event.organizer (User ref), event.organizerProfile (Organizer ref)
 *         name, bio, totalEvents, totalAttendees, rating, website,
 *         phone, email, socials (instagram/facebook/twitter/youtube)
 */
import React from "react";
import { Link } from "react-router-dom";
import {
  BadgeCheck,
  Globe,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  ChevronRight,
  Star,
  Calendar,
  Users,
} from "lucide-react";
import {
  SectionHeading,
  AvatarCircle,
  StarRow,
} from "./shared/EventShared.jsx";

const MOCK_ORGANIZER = {
  name: "Arena Live",
  slug: "arena-live",
  isVerified: true,
  avatar: "A",
  bio: "Arena Live is Bangladesh's premier live event production company, bringing world-class concerts and experiences to audiences across the country since 2015.",
  totalEvents: 48,
  totalAttendees: 120000,
  averageRating: 4.9,
  reviewCount: 842,
  website: "https://arenalive.bd",
  phone: "+880 1700 000000",
  email: "hello@arenalive.bd",
  socials: {
    instagram: "arenalive_bd",
    facebook: "arenalivebd",
    twitter: "arenalive_bd",
    youtube: "AreneLiveBD",
  },
};

const EventOrganizerSection = ({ event }) => {
  const org = event.organizerProfile || event.organizer || MOCK_ORGANIZER;
  const name = org.name || org.username || "Organizer";
  const slug = org.slug || org._id;
  const avatar = (name[0] || "O").toUpperCase();

  const stats = [
    { icon: Calendar, label: "Events", value: org.totalEvents || 0 },
    {
      icon: Users,
      label: "Attendees",
      value: (org.totalAttendees || 0).toLocaleString(),
    },
    {
      icon: Star,
      label: "Rating",
      value: (org.averageRating || org.rating || 0).toFixed(1),
    },
  ];

  const socials = org.socials || {};

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading>Organizer</SectionHeading>

      <div
        className="p-5 rounded-2xl border border-border flex flex-col gap-4"
        style={{ background: "var(--card)" }}
      >
        {/* Header */}
        <div className="flex items-start gap-3">
          {org.avatar ? (
            <img
              src={org.avatar}
              alt={name}
              className="w-12 h-12 rounded-full object-cover border border-border"
            />
          ) : (
            <AvatarCircle
              initial={avatar}
              size={3}
              className="!text-[18px] !w-12 !h-12"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p
                className="text-base font-bold text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {name}
              </p>
              {(org.isVerified || org.verified) && (
                <BadgeCheck size={15} className="text-foreground" />
              )}
            </div>
            <div
              className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {stats.map(({ label, value }) => (
                <span key={label}>
                  {value} {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bio */}
        {org.bio && (
          <p
            className="text-xs text-muted-foreground leading-relaxed"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {org.bio}
          </p>
        )}

        {/* Contact links */}
        <div className="flex flex-wrap gap-3">
          {org.website && (
            <a
              href={org.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <Globe size={12} />
              {org.website.replace(/https?:\/\//, "")}
            </a>
          )}
          {org.email && (
            <a
              href={`mailto:${org.email}`}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <Mail size={12} />
              {org.email}
            </a>
          )}
          {org.phone && (
            <a
              href={`tel:${org.phone}`}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <Phone size={12} />
              {org.phone}
            </a>
          )}
        </div>

        {/* Footer: socials + profile link */}
        <div className="flex items-center gap-3 pt-3 border-t border-border">
          {socials.instagram && (
            <a
              href={`https://instagram.com/${socials.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={15} />
            </a>
          )}
          {socials.facebook && (
            <a
              href={`https://facebook.com/${socials.facebook}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={15} />
            </a>
          )}
          {socials.twitter && (
            <a
              href={`https://twitter.com/${socials.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={15} />
            </a>
          )}
          {socials.youtube && (
            <a
              href={`https://youtube.com/${socials.youtube}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="YouTube"
            >
              <Youtube size={15} />
            </a>
          )}
          {slug && (
            <Link
              to={`/organizer/${slug}`}
              className="ml-auto flex items-center gap-1 text-xs font-semibold text-foreground hover:underline"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              View all events <ChevronRight size={12} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventOrganizerSection;
