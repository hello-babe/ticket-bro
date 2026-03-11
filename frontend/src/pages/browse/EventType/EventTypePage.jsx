// frontend/src/pages/browse/EventType/EventTypePage.jsx
// Route: /:categorySlug/:subCategorySlug/:eventTypeSlug
import React from "react";
import {
  HeroSection, CategoryNavSection, FiltersSection, EventGridSection,
  FeaturedSection, TrendingSection, NewArrivalsSection, UpcomingSection,
  TopRatedSection, EditorsPicksSection, NearbySection, MapSection,
  CalendarSection, RecommendedSection, ReviewsSection, StatsSection, NewsletterSection,
} from "@/components/browse/sections";

const EventTypePage = () => (
  <div>
    <HeroSection />
    <CategoryNavSection />
    <FiltersSection />
    <EventGridSection />
    <FeaturedSection />
    <TrendingSection />
    <NewArrivalsSection />
    <UpcomingSection />
    <TopRatedSection />
    <EditorsPicksSection />
    <NearbySection />
    <MapSection />
    <CalendarSection />
    <RecommendedSection />
    <ReviewsSection />
    <StatsSection />
    <NewsletterSection />
  </div>
);

export default EventTypePage;
