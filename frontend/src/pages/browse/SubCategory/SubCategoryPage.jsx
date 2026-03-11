// frontend/src/pages/browse/SubCategory/SubCategoryPage.jsx
// Route: /:categorySlug/:subCategorySlug
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
} from "@/components/browse/common";

const SubCategoryPage = () => (
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

export default SubCategoryPage;
