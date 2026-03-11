/**
 * useEventDetails.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Hook for the single-event detail page.
 * Loads one event by slug, its related events, and its ticket types.
 * All fields map to event.model.js structure.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchEventBySlug,
  fetchRelatedEvents,
  clearCurrentEvent,
} from '@/store/slices/eventsSlice';
import { EVENT_STATUS } from '@/types/event.types';

const useEventDetails = (slug) => {
  const dispatch = useDispatch();

  const currentEvent = useSelector((s) => s.events.currentEvent);
  const related      = useSelector((s) => s.events.related);
  const loading      = useSelector((s) => s.events.loading);
  const error        = useSelector((s) => s.events.error);

  useEffect(() => {
    if (!slug) return;
    dispatch(fetchEventBySlug(slug));
    dispatch(fetchRelatedEvents(slug));
    return () => {
      dispatch(clearCurrentEvent());
    };
  }, [slug, dispatch]);

  const event = currentEvent;

  // ── Derived values from event.model.js fields ──────────────────────────

  // Organizer (populated ref → User / Organizer)
  const organizer = event?.organizerProfile || event?.organizer || null;

  // Venue / location details (from locationSchema)
  const location  = event?.location || null;
  const mapEmbed  = location?.latLng
    ? `https://maps.google.com/maps?q=${location.latLng.lat},${location.latLng.lng}&output=embed`
    : null;

  // Ticket availability (from capacity virtuals)
  const spotsLeft      = event?.spotsLeft;
  const soldPercentage = event?.soldPercentage || 0;
  const isSoldOut      = event?.isSoldOut || false;
  const canBook        = event?.canPurchase && !isSoldOut;

  // Status checks
  const isPublished  = event?.status === EVENT_STATUS.PUBLISHED;
  const isCancelled  = event?.status === EVENT_STATUS.CANCELLED;
  const isPostponed  = event?.status === EVENT_STATUS.POSTPONED;
  const isCompleted  = event?.status === EVENT_STATUS.COMPLETED;

  // Agenda (agendaItemSchema array)
  const agenda   = event?.agenda || [];
  const hasAgenda = agenda.length > 0;

  // FAQs (faqItemSchema array)
  const faqs    = event?.faqs || [];
  const hasFaqs = faqs.length > 0;

  // Sponsors (sponsorSchema array)
  const sponsors    = event?.sponsors || [];
  const hasSponsors = sponsors.length > 0;

  // Refund policy (refundPolicySchema)
  const refundPolicy = event?.refundPolicy || null;

  // Tags (populated Tag refs)
  const tags = event?.tags || [];

  return {
    event,
    organizer,
    location,
    mapEmbed,
    related,
    agenda,
    hasAgenda,
    faqs,
    hasFaqs,
    sponsors,
    hasSponsors,
    refundPolicy,
    tags,

    // capacity
    spotsLeft,
    soldPercentage,
    isSoldOut,
    canBook,

    // status flags
    isPublished,
    isCancelled,
    isPostponed,
    isCompleted,

    // loading / error
    isLoading:        loading.currentEvent,
    isLoadingRelated: loading.related,
    error:            error.currentEvent,

    // convenience
    notFound: !loading.currentEvent && !event && !!slug,
  };
};

export default useEventDetails;
