// src/pages/home/HomePage.jsx
import React from "react";

// ── Hero & marquee ──────────────────────────────────────────────────────────
import HeroSection         from "@/components/home/HeroSection";
import EventMarquee        from "@/components/home/EventMarquee";

// ── Discovery sections (all powered by useBrowse) ───────────────────────────
import MostLovedCategories from "@/components/home/MostLovedCategories";
import Scenes              from "@/components/home/Scenes";
import LiveNearYou         from "@/components/home/LiveNearYou";
import EventsYouMayLike    from "@/components/home/EventsYouMayLike";
import ExploreByDate       from "@/components/home/ExploreByDate";
import LastChance          from "@/components/home/LastChance";
import ArtistSection       from "@/components/home/ArtistSection";

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
} from "@/components/browse/sections";

// ── Static / CMS sections (no live data needed) ─────────────────────────────
import TrustRibbon         from "@/components/home/TrustRibbon";
import ImpactSection       from "@/components/home/ImpactSection";
import OnlineEventsSection from "@/components/home/OnlineEventsSection";
import VolunteerHeroMonth  from "@/components/home/VolunteerHeroMonth";
import EventPhotos         from "@/components/home/EventPhotos";
import RateFeedback        from "@/components/home/FeedbackSection";
import TopDonorList        from "@/components/home/DonorList";

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
