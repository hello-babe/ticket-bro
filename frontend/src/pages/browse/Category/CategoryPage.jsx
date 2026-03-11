// frontend/src/pages/browse/Category/CategoryPage.jsx
// Route: /:categorySlug
import React from "react";
import {
  HeroSection, CategoryNavSection, FiltersSection, EventGridSection,
  FeaturedSection, TrendingSection, NewArrivalsSection, UpcomingSection,
  TopRatedSection, EditorsPicksSection, NearbySection, MapSection,
  CalendarSection, RecommendedSection, ReviewsSection, StatsSection, NewsletterSection,
} from "@/components/browse/sections";

const CategoryPage = () => (
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

export default CategoryPage;
