/**
 * useBrowse.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Central hook for all browse pages.
 * Field access EXACTLY matches event.model.js (via normaliseEvent()).
 *
 * - Reads useParams() (categorySlug, subCategorySlug, eventTypeSlug)
 * - Reads LocationContext (selectedLocation)
 * - Returns typed getters that filter/sort EVENTS_POOL by city + route level
 *
 * Production swap:
 *   Replace EVENTS_POOL references with useSelector(selectEvents) + dispatch(loadEvents(params))
 *   using useEvents() hook. All section components remain unchanged.
 * ─────────────────────────────────────────────────────────────────────────────
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
  FILTER_FACETS,
} from "@/data/browseData";
import { ROUTES } from "@/app/AppRoutes";

// ── Route level detection ─────────────────────────────────────────────────
export const getLevel = ({ categorySlug, subCategorySlug, eventTypeSlug } = {}) => {
  if (eventTypeSlug)   return "eventType";
  if (subCategorySlug) return "subCategory";
  if (categorySlug)    return "category";
  return "root";
};

// ── URL slug helpers ──────────────────────────────────────────────────────
export const unslugify = (slug = "") =>
  slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export const toSlug = (str = "") =>
  str.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-");

// ── Capacity helpers (mirrors virtual fields) ─────────────────────────────
export const spotsPercent = (event) => {
  if (!event?.totalCapacity) return 0;
  return Math.round(((event.totalSold || 0) / event.totalCapacity) * 100);
};

export const formatAttendees = (n) => {
  if (!n && n !== 0) return "–";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
};

// ── Main hook ─────────────────────────────────────────────────────────────
const useBrowse = () => {
  const params = useParams();
  const { categorySlug, subCategorySlug, eventTypeSlug } = params;
  const { selectedLocation } = useLocationCtx();

  const cityId = selectedLocation?.id;    // e.g. "dhaka"
  const cityLabel = selectedLocation?.label || selectedLocation?.name || "Your City";
  const locationFlag = selectedLocation?.flag || "📍";

  const level  = getLevel({ categorySlug, subCategorySlug, eventTypeSlug });
  const config = categorySlug
    ? (CATEGORY_MAP[categorySlug] || ALL_EVENTS_CONFIG)
    : ALL_EVENTS_CONFIG;

  // ── Base filter: city + taxonomy slug matching ─────────────────────────
  const baseEvents = useMemo(() => {
    return EVENTS_POOL.filter((e) => {
      // city filter — maps to event.model.js  location.city
      if (cityId && cityId !== "current" && e.location?.city && e.location.city !== cityId) {
        return false;
      }
      // taxonomy filter — matches category.slug, subcategory.slug, eventType.slug
      if (categorySlug    && e.category?.slug    !== categorySlug)    return false;
      if (subCategorySlug && e.subcategory?.slug !== subCategorySlug) return false;
      if (eventTypeSlug   && e.eventType?.slug   !== eventTypeSlug)   return false;
      return true;
    });
  }, [cityId, categorySlug, subCategorySlug, eventTypeSlug]);

  // ── Named getters (each maps to an event.model.js static/query) ───────

  /** All events matching current scope — maps to Event.published() */
  const getEvents         = () => baseEvents;

  /** isFeatured=true — maps to Event.published().where({isFeatured:true}) */
  const getFeatured       = () => baseEvents.filter((e) => e.isFeatured).slice(0, 6);

  /** Sort by trendScore desc — maps to Event.trending() */
  const getTrending       = () => [...baseEvents].sort((a, b) => (b.trendScore || 0) - (a.trendScore || 0)).slice(0, 8);

  /** Sort by averageRating desc — maps to Event.published().sort({averageRating:-1}) */
  const getTopRated       = () => [...baseEvents].sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0)).slice(0, 8);

  /** Events created recently — maps to Event.published().sort({createdAt:-1}) */
  const getNewArrivals    = () => baseEvents.filter((e) => e._newArrival).slice(0, 8);

  /** Events with location.latLng populated — maps to Event.nearLocation() */
  const getNearby         = () => baseEvents.filter((e) => e._distance).slice(0, 8);

  /** _editorsPick flag (UI-only, no model field; production: curated list) */
  const getEditorsPicks   = () => baseEvents.filter((e) => e._editorsPick).slice(0, 6);

  /** _reason flag (UI-only; production: recommendation engine) */
  const getRecommended    = () => baseEvents.filter((e) => e._reason).slice(0, 6);

  /** isUpcoming = startDate > now — maps to Event.upcoming() */
  const getUpcoming       = () => {
    const now = new Date();
    return [...baseEvents]
      .filter((e) => e.startDate && e.startDate > now)
      .sort((a, b) => a.startDate - b.startDate)
      .slice(0, 8);
  };

  /** Reviews — maps to GET /api/reviews?location.city=dhaka */
  const getReviews        = () => {
    if (!cityId || cityId === "current") return REVIEWS_POOL.slice(0, 6);
    return REVIEWS_POOL.filter((r) => r.city === cityId).slice(0, 6);
  };

  /** Platform stats — maps to GET /api/stats?category=music */
  const getStats          = () => PLATFORM_STATS[categorySlug] || PLATFORM_STATS.root;

  /** Filter facets — maps to GET /api/events/facets */
  const getFacets         = () => FILTER_FACETS;

  // ── URL builders ──────────────────────────────────────────────────────

  const buildEventUrl = (event) => {
    // Use populated taxonomy slugs when available
    const cat  = event.category?.slug    || categorySlug    || "events";
    const sub  = event.subcategory?.slug || subCategorySlug || cat;
    const type = event.eventType?.slug   || eventTypeSlug   || sub;
    return ROUTES.BROWSE.EVENT(cat, sub, type, event.slug);
  };

  const buildCategoryUrl = (cat) =>
    ROUTES.BROWSE.CATEGORY(cat);

  const buildSubCategoryUrl = (cat, sub) =>
    ROUTES.BROWSE.SUBCATEGORY(cat, sub);

  const buildEventTypeUrl = (cat, sub, type) =>
    ROUTES.BROWSE.EVENT_TYPE(cat, sub, type);

  // ── Total count for current scope ─────────────────────────────────────
  const totalCount = useMemo(() => baseEvents.length || config.totalEvents || 0, [baseEvents, config]);

  // ── Hero description ──────────────────────────────────────────────────
  const getHeroDescription = () => {
    if (level === "root")       return `Discover ${totalCount.toLocaleString()}+ events happening in ${cityLabel} and beyond. From music to sports, arts to food — find what excites you.`;
    if (level === "category")   return config.description || `Explore the best ${config.label} events in ${cityLabel}.`;
    if (level === "subCategory") return `Browse ${unslugify(subCategorySlug)} events under ${config.label} in ${cityLabel}.`;
    return `Explore ${unslugify(eventTypeSlug)} — a type of ${unslugify(subCategorySlug)} event in ${config.label}.`;
  };

  return {
    // context
    level,
    config,
    categorySlug,
    subCategorySlug,
    eventTypeSlug,
    cityId,
    cityLabel,
    locationLabel: cityLabel,
    locationFlag,
    totalCount,
    getHeroDescription,
    isRoot:        level === "root",
    isCategory:    level === "category",
    isSubCategory: level === "subCategory",
    isEventType:   level === "eventType",

    // data getters (replace with API calls in production)
    getEvents,
    getFeatured,
    getTrending,
    getTopRated,
    getNewArrivals,
    getNearby,
    getEditorsPicks,
    getRecommended,
    getUpcoming,
    getReviews,
    getStats,
    getFacets,

    // URL builders
    buildEventUrl,
    buildCategoryUrl,
    buildSubCategoryUrl,
    buildEventTypeUrl,

    // pure helpers (exported for direct import too)
    unslugify,
    toSlug,
    spotsPercent,
    formatAttendees,

    // data shape maps (same source as API responses in production)
    CATEGORY_MAP,
  };
};

export default useBrowse;