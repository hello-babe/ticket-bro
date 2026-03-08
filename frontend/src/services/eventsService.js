// frontend/src/services/eventsService.js
// Real API-backed service — replaces the old mock-data file.

import api from '@/api/api';

// ── Public reads ─────────────────────────────────────────────────────────────
export const getAllEvents        = (params)       => api.get('/events', { params }).then(r => r.data.data?.events || []);
export const getFeaturedEvents   = (limit = 6)    => api.get('/events/featured', { params: { limit } }).then(r => r.data.data?.events || []);
export const getTrendingEvents   = (limit = 6)    => api.get('/events/trending', { params: { limit } }).then(r => r.data.data?.events || []);
export const getUpcomingEvents   = (limit = 8)    => api.get('/events/upcoming', { params: { limit } }).then(r => r.data.data?.events || []);
export const getEventBySlug      = (slug)         => api.get(`/events/${slug}`).then(r => r.data.data?.event || null);
export const getEventDetails     = (slug)         => api.get(`/events/${slug}/details`).then(r => r.data.data || null);
export const getEventTickets     = (slug)         => api.get(`/events/${slug}/tickets`).then(r => r.data.data?.ticketTypes || []);
export const getEventReviews     = (slug, params) => api.get(`/events/${slug}/reviews`, { params }).then(r => r.data.data || {});
export const getRelatedEvents    = (slug)         => api.get(`/events/${slug}/related`).then(r => r.data.data?.events || []);
export const getTicketTypes      = (slug)         => api.get(`/events/${slug}/ticket-types`).then(r => r.data.data?.ticketTypes || []);
export const getSeatSections     = (slug)         => api.get(`/events/${slug}/seat-sections`).then(r => r.data.data?.sections || []);
export const getSeatMap          = (slug)         => api.get(`/events/${slug}/seat-map`).then(r => r.data.data || null);

// ── Category helpers ──────────────────────────────────────────────────────────
export const getAllCategories        = ()           => api.get('/categories').then(r => r.data.data?.categories || []);
export const getCategoryBySlug       = (slug)       => api.get(`/categories/${slug}`).then(r => r.data.data?.category || null);
export const getCategoryData         = async (slug) => {
  const [category, subcategories, events] = await Promise.all([
    getCategoryBySlug(slug),
    api.get(`/categories/${slug}/subcategories`).then(r => r.data.data?.subcategories || []),
    getAllEvents({ category: slug }),
  ]);
  if (!category) return null;
  return {
    ...category,
    subcategories,
    featuredEvents:  events.filter(e => e.isFeatured).slice(0, 3),
    heroEvents:      events.slice(0, 5),
    upcomingEvents:  events.slice(3, 11),
    trendingEvents:  [...events].sort((a,b)=>(b.rating||0)-(a.rating||0)).slice(0,6),
    stats: {
      totalEvents:       events.length,
      totalTicketsSold:  events.reduce((s,e) => s + (e.ticketsSold||0), 0),
      averageRating:     events.reduce((s,e) => s + (e.rating||0), 0) / (events.length||1),
      venues:            [...new Set(events.map(e=>e.venue))].length,
    },
  };
};
export const getSubcategoriesByCategory = (slug)       => api.get(`/categories/${slug}/subcategories`).then(r => r.data.data?.subcategories || []);
export const getSubcategoryData         = async (cat, sub) => {
  const [category, subcategory, events] = await Promise.all([
    getCategoryBySlug(cat),
    api.get(`/categories/${cat}/subcategories`).then(r => (r.data.data?.subcategories||[]).find(s=>s.slug===sub)),
    getAllEvents({ category: cat, subcategory: sub }),
  ]);
  if (!category || !subcategory) return null;
  const now = new Date();
  return {
    ...subcategory,
    category,
    events,
    upcomingEvents: events.filter(e => new Date(e.date) > now).sort((a,b)=>new Date(a.date)-new Date(b.date)),
    pastEvents:     events.filter(e => new Date(e.date) < now).sort((a,b)=>new Date(b.date)-new Date(a.date)),
    featuredEvents: [...events].sort((a,b)=>(b.rating||0)-(a.rating||0)).slice(0,4),
    totalEvents:    events.length,
  };
};

// ── Search helpers ────────────────────────────────────────────────────────────
export const searchEvents    = (query, filters = {}) => api.get('/search', { params: { q: query, ...filters } }).then(r => r.data.data?.results || []);
export const getPopularCities= ()                    => api.get('/locations/cities').then(r => r.data.data?.cities || []);
export const getEventById    = (id)                  => api.get(`/events/${id}`).then(r => r.data.data?.event || null).catch(() => null);
export const getEventsByVenue= (venueId)             => getAllEvents({ venueId });
export const getEventsByArtist=(name)                => getAllEvents({ artist: name });

// ── Organizer writes ──────────────────────────────────────────────────────────
export const createEvent          = (data)        => api.post('/events', data);
export const updateEvent          = (slug, data)  => api.put(`/events/${slug}`, data);
export const deleteEvent          = (slug)        => api.delete(`/events/${slug}`);
export const publishEvent         = (slug)        => api.post(`/events/${slug}/publish`);
export const cancelEvent          = (slug, data)  => api.post(`/events/${slug}/cancel`, data);
export const createTicketType     = (slug, data)  => api.post(`/events/${slug}/ticket-types`, data);
export const updateTicketType     = (slug, id, d) => api.put(`/events/${slug}/ticket-types/${id}`, d);
export const deleteTicketType     = (slug, id)    => api.delete(`/events/${slug}/ticket-types/${id}`);
export const createSeatSection    = (slug, data)  => api.post(`/events/${slug}/seat-sections`, data);
export const updateSeatSection    = (slug, id, d) => api.put(`/events/${slug}/seat-sections/${id}`, d);

// Default export for backwards compatibility
export default {
  getAllEvents, getFeaturedEvents, getTrendingEvents, getUpcomingEvents,
  getEventBySlug, getEventById, getEventDetails, searchEvents,
  getAllCategories, getCategoryBySlug, getCategoryData,
  getSubcategoriesByCategory, getSubcategoryData, getPopularCities,
  getEventsByVenue, getEventsByArtist,
};
