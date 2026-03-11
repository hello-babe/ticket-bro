// frontend/src/pages/browse/Category/CategoryPage.jsx
// Route: /:categorySlug
import React from "react";
import {
  HeroSection,
  FiltersSection,
  EventGridSection,
  FeaturedSection,
  TrendingSection,
  NewArrivalsSection,
  UpcomingSection,
  TopRatedSection,
  EditorsPicksSection,
  NearbySection,
  MapSection,
  CalendarSection,
  RecommendedSection,
  ReviewsSection,
  StatsSection,
  NewsletterSection,
} from "@/components/browse/common";

const CategoryPage = () => (
  <div>
    <HeroSection />
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

export default CategoryPage;
