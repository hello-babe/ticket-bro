// Thin wrapper around eventsService for event detail pages
import { getEventDetails, getRelatedEvents, getEventReviews } from './eventsService';

const eventDetailsService = {
  getDetails:      (slug)         => getEventDetails(slug),
  getRelated:      (slug)         => getRelatedEvents(slug),
  getReviews:      (slug, params) => getEventReviews(slug, params),
};
export default eventDetailsService;
