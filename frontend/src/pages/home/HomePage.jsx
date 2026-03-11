// src/pages/home/HomePage.jsx
import React from "react";

// ── Hero & marquee ──────────────────────────────────────────────────────────
import HeroSection from "@/components/browse/home/HeroSection";
import EventMarquee from "@/components/browse/home/EventMarquee";

// ── Discovery sections (all powered by useBrowse) ───────────────────────────
import MostLovedCategories from "@/components/browse/home/MostLovedCategories";
import Scenes from "@/components/browse/home/Scenes";
import LiveNearYou from "@/components/browse/home/LiveNearYou";
import EventsYouMayLike from "@/components/browse/home/EventsYouMayLike";
import ExploreByDate from "@/components/browse/home/ExploreByDate";
import LastChance from "@/components/browse/home/LastChance";
import ArtistSection from "@/components/browse/home/ArtistSection";

// ── Browse section re-exports (use useBrowse internally) ────────────────────
import {
  FiltersSection,
  TopRatedSection,
  TrendingSection,
  FeaturedSection,
  NewArrivalsSection,
  UpcomingSection,
  EditorsPicksSection,
  RecommendedSection,
  StatsSection,
  ReviewsSection,
  NewsletterSection,
} from "@/components/browse/common";

// ── Static / CMS sections (no live data needed) ─────────────────────────────
import TrustRibbon from "@/components/browse/home/TrustRibbon";
import ImpactSection from "@/components/browse/home/ImpactSection";
import OnlineEventsSection from "@/components/browse/home/OnlineEventsSection";
import VolunteerHeroMonth from "@/components/browse/home/VolunteerHeroMonth";
import EventPhotos from "@/components/browse/home/EventPhotos";
import RateFeedback from "@/components/browse/home/FeedbackSection";
import TopDonorList from "@/components/browse/home/DonorList";

const HomePage = () => (
  <>
    <HeroSection />
    <EventMarquee />
    <FiltersSection />
    <MostLovedCategories />
    <StatsSection />
    <Scenes />
    <LiveNearYou />
    <TopRatedSection />
    <EditorsPicksSection />
    <FeaturedSection />
    <EventsYouMayLike />
    <RecommendedSection />
    <ExploreByDate />
    <UpcomingSection />
    <NewArrivalsSection />
    <LastChance />
    <ArtistSection />
    <TrustRibbon />
    <OnlineEventsSection />
    <ImpactSection />
    <VolunteerHeroMonth />
    <ReviewsSection />
    <RateFeedback />
    <EventPhotos />
    <NewsletterSection />
    <TopDonorList />
  </>
);

export default HomePage;
