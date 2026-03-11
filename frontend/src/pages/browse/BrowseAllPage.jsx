// frontend/src/pages/browse/BrowsePage.jsx
// Route: /browse — All Events page
import React from "react";
import {
  HeroSection,
  CategoryNavSection,
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
  AppDownloadSection,
} from "@/components/browse/common";

const BrowsePage = () => (
  <>
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
    <AppDownloadSection />
    <NewsletterSection />
  </>
);

export default BrowsePage;
