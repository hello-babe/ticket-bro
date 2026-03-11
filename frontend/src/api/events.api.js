/**
 * events.api.js
 * ─────────────────────────────────────────────────────────────────────────────
 * All API calls for the Event resource.
 * Query param names EXACTLY match event.model.js field names & indexes.
 *
 * Response shapes (from the real API):
 *   GET /api/events              → { data: { events: Event[], pagination } }
 *   GET /api/events/:slug        → { data: { event: Event } }
 *   GET /api/events/featured     → { data: { events: Event[] } }
 *   GET /api/events/trending     → { data: { events: Event[] } }
 *   GET /api/events/upcoming     → { data: { events: Event[] } }
 *   GET /api/events/:slug/related → { data: { events: Event[] } }
 *   GET /api/events/:slug/reviews → { data: { reviews: [], pagination } }
 *   GET /api/events/:slug/tickets → { data: { ticketTypes: [] } }
 *   GET /api/events/facets        → { data: { facets: {} } }
 * ─────────────────────────────────────────────────────────────────────────────
 */
import api from "@/lib/axios";

// ── Public reads ──────────────────────────────────────────────────────────

/**
 * GET /api/events
 * Supports all event.model.js query fields via params:
 *   status, visibility, isFeatured, isTrending, isFree
 *   "location.city", category, subcategory, eventType
 *   startDate[gte], startDate[lte], minPrice, maxPrice
 *   sort, page, limit, q (full-text search)
 */
export const getAllEvents = (params) =>
  api.get("/events", { params }).then((r) => r.data.data || []);

/** GET /api/events/featured — returns events where isFeatured=true */
export const getFeaturedEvents = (limit = 6) =>
  api.get("/events/featured", { params: { limit } })
     .then((r) => r.data.data?.events || []);

/**
 * GET /api/events/trending
 * Sorted by trendScore desc (mirrors Event.trending() static)
 */
export const getTrendingEvents = (limit = 8) =>
  api.get("/events/trending", { params: { limit } })
     .then((r) => r.data.data?.events || []);

/**
 * GET /api/events/upcoming
 * startDate >= now, sorted soonest-first (mirrors Event.upcoming() static)
 */
export const getUpcomingEvents = (limit = 8) =>
  api.get("/events/upcoming", { params: { limit } })
     .then((r) => r.data.data?.events || []);

/** GET /api/events/:slug — full event document */
export const getEventBySlug = (slug) =>
  api.get(`/events/${slug}`).then((r) => r.data.data?.event || null);

/** GET /api/events/:slug — alias for detail pages */
export const getEventDetails = (slug) =>
  api.get(`/events/${slug}/details`).then((r) => r.data.data || null);

/**
 * GET /api/events/:slug/tickets
 * Returns Ticket[] refs (event.model.js tickets field)
 */
export const getEventTickets = (slug) =>
  api.get(`/events/${slug}/tickets`)
     .then((r) => r.data.data?.ticketTypes || []);

/**
 * GET /api/events/:slug/reviews
 * Params: page, limit, sort (-date, -helpful)
 * Returns reviews for this event + reviewCount / averageRating summary
 */
export const getEventReviews = (slug, params) =>
  api.get(`/events/${slug}/reviews`, { params }).then((r) => r.data.data || {});

/**
 * GET /api/events/:slug/related
 * Backend selects events with same category + similar tags
 */
export const getRelatedEvents = (slug) =>
  api.get(`/events/${slug}/related`).then((r) => r.data.data?.events || []);

/**
 * GET /api/events/:slug/ticket-types
 * Returns Ticket type documents linked to this event
 */
export const getTicketTypes = (slug) =>
  api.get(`/events/${slug}/ticket-types`)
     .then((r) => r.data.data?.ticketTypes || []);

/**
 * GET /api/events/:slug/seat-sections
 * Returns Seat sections for events with seating (event.model.js seats field)
 */
export const getSeatSections = (slug) =>
  api.get(`/events/${slug}/seat-sections`)
     .then((r) => r.data.data?.sections || []);

/** GET /api/events/:slug/seat-map — full seat map for seating picker */
export const getSeatMap = (slug) =>
  api.get(`/events/${slug}/seat-map`).then((r) => r.data.data || null);

/**
 * GET /api/events/facets
 * Returns aggregated counts per filter facet for current query scope.
 * Params: category, subcategory, "location.city", status
 */
export const getEventFacets = (params) =>
  api.get("/events/facets", { params }).then((r) => r.data.data?.facets || {});

/**
 * GET /api/events/near?lng=&lat=&radius=
 * Wraps Event.nearLocation() — returns events sorted by geo proximity.
 * Requires location.coordinates 2dsphere index.
 */
export const getNearbyEvents = (lng, lat, radiusKm = 30) =>
  api.get("/events/near", { params: { lng, lat, radius: radiusKm } })
     .then((r) => r.data.data?.events || []);

// ── Category helpers ───────────────────────────────────────────────────────

/** GET /api/categories */
export const getAllCategories = () =>
  api.get("/categories").then((r) => r.data.data?.categories || []);

/** GET /api/categories/:slug */
export const getCategoryBySlug = (slug) =>
  api.get(`/categories/${slug}`).then((r) => r.data.data?.category || null);

/** GET /api/categories/:slug/subcategories */
export const getSubcategoriesByCategory = (slug) =>
  api.get(`/categories/${slug}/subcategories`)
     .then((r) => r.data.data?.subcategories || []);

/**
 * Composite: category detail + subcategories + events in one call.
 * Uses event.model.js query fields for the events fetch.
 */
export const getCategoryData = async (slug) => {
  const [category, subcategories, result] = await Promise.all([
    getCategoryBySlug(slug),
    getSubcategoriesByCategory(slug),
    getAllEvents({
      category:   slug,
      status:     "published",
      visibility: "public",
      limit:      50,
    }),
  ]);
  if (!category) return null;
  const events = Array.isArray(result) ? result : (result?.events || []);
  const now    = new Date();
  return {
    ...category,
    subcategories,
    featuredEvents:  events.filter((e) => e.isFeatured).slice(0, 6),
    trendingEvents:  [...events].sort((a, b) => (b.trendScore || 0) - (a.trendScore || 0)).slice(0, 6),
    upcomingEvents:  events.filter((e) => new Date(e.startDate) > now).slice(0, 8),
    stats: {
      totalEvents:      events.length,
      totalTicketsSold: events.reduce((s, e) => s + (e.totalSold || 0), 0),
      averageRating:    events.reduce((s, e) => s + (e.averageRating || 0), 0) / (events.length || 1),
    },
  };
};

/**
 * Composite: subcategory detail + sibling subcategories + events.
 * Uses event.model.js field names: subcategory (slug), startDate
 */
export const getSubcategoryData = async (cat, sub) => {
  const [category, subcategories, result] = await Promise.all([
    getCategoryBySlug(cat),
    getSubcategoriesByCategory(cat),
    getAllEvents({
      category:   cat,
      subcategory: sub,
      status:     "published",
      visibility: "public",
      limit:      50,
    }),
  ]);
  const subcategory = subcategories.find((s) => s.slug === sub);
  if (!category || !subcategory) return null;
  const events = Array.isArray(result) ? result : (result?.events || []);
  const now    = new Date();
  return {
    ...subcategory,
    category,
    events,
    upcomingEvents: events
      .filter((e) => new Date(e.startDate) > now)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate)),
    pastEvents: events
      .filter((e) => new Date(e.endDate) < now)
      .sort((a, b) => new Date(b.endDate) - new Date(a.endDate)),
    featuredEvents: events.filter((e) => e.isFeatured).slice(0, 4),
    totalEvents:    events.length,
  };
};

// ── Search ────────────────────────────────────────────────────────────────

/**
 * GET /api/search
 * Full-text search uses event.model.js text index:
 *   title (weight 10), shortDescription (5), description (1), seo.keywords (3)
 */
export const searchEvents = (query, filters = {}) =>
  api.get("/search", { params: { q: query, ...filters } })
     .then((r) => r.data.data?.results || []);

/** GET /api/locations/cities — city list for LocationPicker */
export const getPopularCities = () =>
  api.get("/locations/cities").then((r) => r.data.data?.cities || []);

/** GET /api/events/:id — ObjectId lookup (for redirect from old /events/:id URLs) */
export const getEventById = (id) =>
  api.get(`/events/${id}`).then((r) => r.data.data?.event || null).catch(() => null);

// ── Organizer / admin writes ───────────────────────────────────────────────

/** POST /api/events — create new event (status=draft by default) */
export const createEvent = (data) => api.post("/events", data);

/** PUT /api/events/:slug — update any mutable field */
export const updateEvent = (slug, data) => api.put(`/events/${slug}`, data);

/** DELETE /api/events/:slug — soft-delete (sets deletedAt) */
export const deleteEvent = (slug) => api.delete(`/events/${slug}`);

/** POST /api/events/:slug/publish — status: draft → pending or published */
export const publishEvent = (slug) => api.post(`/events/${slug}/publish`);

/** POST /api/events/:slug/cancel — status: published → cancelled */
export const cancelEvent = (slug, data) => api.post(`/events/${slug}/cancel`, data);

/** POST /api/events/:slug/postpone — status: published → postponed */
export const postponeEvent = (slug, data) => api.post(`/events/${slug}/postpone`, data);

// ── Ticket type CRUD (event.model.js tickets[] ref) ───────────────────────
export const createTicketType = (slug, data) => api.post(`/events/${slug}/ticket-types`, data);
export const updateTicketType = (slug, id, d) => api.put(`/events/${slug}/ticket-types/${id}`, d);
export const deleteTicketType = (slug, id)    => api.delete(`/events/${slug}/ticket-types/${id}`);

// ── Seat section CRUD (event.model.js seats[] ref) ────────────────────────
export const createSeatSection = (slug, data) => api.post(`/events/${slug}/seat-sections`, data);
export const updateSeatSection = (slug, id, d) => api.put(`/events/${slug}/seat-sections/${id}`, d);

// ── Social actions ────────────────────────────────────────────────────────
/** POST /api/events/:slug/like — increments likeCount */
export const likeEvent = (slug) => api.post(`/events/${slug}/like`);

/** POST /api/events/:slug/bookmark — increments bookmarkCount */
export const bookmarkEvent = (slug) => api.post(`/events/${slug}/bookmark`);

/** DELETE /api/events/:slug/bookmark */
export const unbookmarkEvent = (slug) => api.delete(`/events/${slug}/bookmark`);

/** POST /api/events/:slug/share — increments shareCount */
export const shareEvent = (slug) => api.post(`/events/${slug}/share`);

/** POST /api/events/:slug/view — increments viewCount / uniqueViewCount */
export const trackEventView = (slug) => api.post(`/events/${slug}/view`).catch(() => null);

// ── Default export ─────────────────────────────────────────────────────────
export default {
  getAllEvents,
  getFeaturedEvents,
  getTrendingEvents,
  getUpcomingEvents,
  getEventBySlug,
  getEventById,
  getEventDetails,
  getRelatedEvents,
  getEventFacets,
  getNearbyEvents,
  searchEvents,
  getAllCategories,
  getCategoryBySlug,
  getCategoryData,
  getSubcategoriesByCategory,
  getSubcategoryData,
  getPopularCities,
  createEvent,
  updateEvent,
  deleteEvent,
  publishEvent,
  cancelEvent,
  postponeEvent,
  likeEvent,
  bookmarkEvent,
  unbookmarkEvent,
  shareEvent,
  trackEventView,
};
