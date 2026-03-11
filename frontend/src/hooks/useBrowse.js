/**
 * useBrowse.js — Central hook for all browse pages.
 *
 * Provides:
 *   - Parsed route params (level, slugs)
 *   - Category config from CATEGORY_MAP
 *   - Location from LocationContext
 *   - Filtered event sets (all, featured, trending, nearby, etc.)
 *   - Event count helpers
 *
 * Usage:
 *   const browse = useBrowse();
 *   browse.level          // "root" | "category" | "subCategory" | "eventType"
 *   browse.config         // CATEGORY_MAP entry for current category (or ALL_EVENTS_CONFIG)
 *   browse.locationLabel  // "Dhaka"
 *   browse.getEvents()    // all filtered events for current route + location
 *   browse.getFeatured()  // featured events
 *   browse.getTrending()  // sorted by trendScore
 *   browse.getTopRated()  // sorted by rating
 *   browse.getNewArrivals()
 *   browse.getNearby()
 *   browse.getEditorsPicks()
 *   browse.getRecommended()
 *   browse.getUpcoming()  // next 7 days
 *   browse.getReviews()
 *   browse.getStats()
 *   browse.totalCount
 *   browse.buildEventUrl(event) → route string
 */

import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useLocation as useLocationCtx } from "@/context/LocationContext";
import {
  EVENTS_POOL,
  CATEGORY_MAP,
  ALL_EVENTS_CONFIG,
  REVIEWS_POOL,
  PLATFORM_STATS,
} from "@/data/browseData";

/* ─── pure helpers ─────────────────────────────────────────────── */
export const unslugify = (slug = "") =>
  slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

export const toSlug = (str = "") =>
  str.toLowerCase().replace(/[&\s]+/g, "-");

export const spotsPercent = (attendees, capacity) =>
  Math.min(100, Math.round((attendees / capacity) * 100));

export const formatAttendees = (n) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

export const getLevel = (categorySlug, subCategorySlug, eventTypeSlug) => {
  if (eventTypeSlug) return "eventType";
  if (subCategorySlug) return "subCategory";
  if (categorySlug) return "category";
  return "root";
};

/* ─── core filter ─────────────────────────────────────────────── */
const filterByRoute = (events, level, categorySlug, subCategorySlug, eventTypeSlug) => {
  if (level === "category")    return events.filter((e) => e.category === categorySlug);
  if (level === "subCategory") return events.filter((e) => e.category === categorySlug && e.subCategory === toSlug(subCategorySlug));
  if (level === "eventType")   return events.filter((e) => e.category === categorySlug && e.subCategory === toSlug(subCategorySlug) && e.eventType === toSlug(eventTypeSlug));
  return events; // root — all
};

const filterByLocation = (events, locationId) => {
  if (!locationId || locationId === "current") return events;
  return events.filter((e) => e.city === locationId);
};

/* ═══════════════════════════════════════════════════════════════
   useBrowse HOOK
═══════════════════════════════════════════════════════════════ */
export const useBrowse = () => {
  const { categorySlug, subCategorySlug, eventTypeSlug } = useParams();
  const { selectedLocation, changeLocation, locations } = useLocationCtx();

  const level         = getLevel(categorySlug, subCategorySlug, eventTypeSlug);
  const config        = CATEGORY_MAP[categorySlug] ?? ALL_EVENTS_CONFIG;
  const locationId    = selectedLocation?.id;
  const locationLabel = selectedLocation?.label ?? "your city";
  const locationFlag  = selectedLocation?.flag  ?? "📍";

  /* base pool filtered by route + location */
  const basePool = useMemo(
    () => filterByLocation(
            filterByRoute(EVENTS_POOL, level, categorySlug, subCategorySlug, eventTypeSlug),
            locationId
          ),
    [level, categorySlug, subCategorySlug, eventTypeSlug, locationId]
  );

  /* stats scoped to category + location */
  const stats = useMemo(() => {
    const base = PLATFORM_STATS[categorySlug] ?? PLATFORM_STATS.root;
    // If we have real events for this location, use actual counts; else scale down mock
    const locationRatio = locationId && locationId !== "current" ? 0.4 : 1;
    return {
      events:      Math.round(base.events * locationRatio),
      organizers:  Math.round(base.organizers * locationRatio),
      cities:      base.cities,
      ticketsSold: Math.round(base.ticketsSold * locationRatio),
      avgRating:   base.avgRating,
    };
  }, [categorySlug, locationId]);

  /* derived event sets */
  const getEvents      = ()         => basePool;
  const getFeatured    = ()         => basePool.filter((e) => e.featured).slice(0, 6);
  const getTrending    = ()         => [...basePool].sort((a, b) => b.trendScore - a.trendScore).slice(0, 8);
  const getTopRated    = ()         => [...basePool].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount).slice(0, 8);
  const getNewArrivals = ()         => basePool.filter((e) => e.newArrival).slice(0, 8);
  const getNearby      = ()         => [...basePool].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance)).slice(0, 8);
  const getEditorsPicks= ()         => basePool.filter((e) => e.editorsPick).slice(0, 6);
  const getRecommended = ()         => [...basePool].sort(() => Math.random() - 0.5).slice(0, 6);
  const getUpcoming    = (days = 7) => basePool.slice(0, 8); // in prod: filter by date range
  const getReviews     = ()         => REVIEWS_POOL.filter((r) => !locationId || r.city === locationId).slice(0, 6);
  const getStats       = ()         => stats;

  /* URL builder — uses flat route scheme: /:cat/:sub/:type/:slug */
  const buildEventUrl = (event) =>
    `/${event.category}/${event.subCategory}/${event.eventType}/${event.slug}`;

  const buildCategoryUrl    = (cat)           => `/${cat}`;
  const buildSubCategoryUrl = (cat, sub)      => `/${cat}/${toSlug(sub)}`;
  const buildEventTypeUrl   = (cat, sub, type)=> `/${cat}/${toSlug(sub)}/${toSlug(type)}`;

  /* dynamic hero description */
  const getHeroDescription = () => {
    if (level === "root")
      return `Discover thousands of events happening in ${locationLabel} and beyond.`;
    if (level === "category")
      return `${config.description} Events near ${locationLabel}.`;
    if (level === "subCategory")
      return `Explore all ${unslugify(subCategorySlug)} events in ${locationLabel}.`;
    return `All ${unslugify(eventTypeSlug)} events in ${unslugify(subCategorySlug)}, ${locationLabel}.`;
  };

  return {
    // route
    level, categorySlug, subCategorySlug, eventTypeSlug,
    // category
    config,
    categoryLabel: config.label,
    subcategories: config.subcategories,
    // location
    selectedLocation, changeLocation, locations,
    locationId, locationLabel, locationFlag,
    // event helpers
    totalCount: basePool.length,
    getEvents, getFeatured, getTrending, getTopRated,
    getNewArrivals, getNearby, getEditorsPicks,
    getRecommended, getUpcoming, getReviews, getStats,
    // url builders
    buildEventUrl, buildCategoryUrl, buildSubCategoryUrl, buildEventTypeUrl,
    // content
    getHeroDescription,
    // raw
    CATEGORY_MAP,
    ALL_EVENTS_CONFIG,
  };
};

export default useBrowse;
