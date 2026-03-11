/**
 * browseData.js — Single source of truth for all browse mock/static data.
 *
 * Production replacement guide:
 *   EVENTS_POOL  → GET /api/events?{category,sub,type,location,page,limit,sort,...}
 *   CATEGORY_MAP → GET /api/categories  (or embedded app config)
 *   FEATURED / TRENDING / NEARBY etc. → GET /api/events/{featured|trending|nearby}?location=dhaka
 *
 * All browse components import from here — never define inline mock data.
 */

import {
  Music, Dumbbell, Palette, UtensilsCrossed, Briefcase,
  GraduationCap, Heart, Cpu, Baby, Users, Layers,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   CATEGORY CONFIG
═══════════════════════════════════════════════════════════════ */
export const CATEGORY_MAP = {
  music: {
    label: "Music", icon: Music,
    description: "Live concerts, festivals, club nights and more.",
    totalEvents: 1284, cities: 48, thisWeek: 73,
    subcategories: ["Concerts", "Festivals", "Club Nights", "Live Bands", "Open Mic"],
  },
  sports: {
    label: "Sports", icon: Dumbbell,
    description: "Football, cricket, tennis, and every sport in between.",
    totalEvents: 894, cities: 32, thisWeek: 51,
    subcategories: ["Football", "Cricket", "Tennis", "Basketball", "Athletics"],
  },
  "arts-culture": {
    label: "Arts & Culture", icon: Palette,
    description: "Theatre, exhibitions, film screenings, and performances.",
    totalEvents: 642, cities: 27, thisWeek: 38,
    subcategories: ["Theatre", "Exhibitions", "Film", "Dance", "Literature"],
  },
  "food-drink": {
    label: "Food & Drink", icon: UtensilsCrossed,
    description: "Pop-ups, tastings, dining events, and food festivals.",
    totalEvents: 431, cities: 19, thisWeek: 29,
    subcategories: ["Dining", "Tastings", "Pop-Up", "Street Food", "Wine"],
  },
  business: {
    label: "Business", icon: Briefcase,
    description: "Conferences, networking, expos, and workshops.",
    totalEvents: 318, cities: 22, thisWeek: 17,
    subcategories: ["Conferences", "Networking", "Workshops", "Seminars", "Expos"],
  },
  education: {
    label: "Education", icon: GraduationCap,
    description: "Lectures, courses, seminars, and bootcamps.",
    totalEvents: 276, cities: 18, thisWeek: 21,
    subcategories: ["Seminars", "Courses", "Workshops", "Lectures", "Boot Camps"],
  },
  health: {
    label: "Health & Wellness", icon: Heart,
    description: "Yoga, meditation, fitness classes, and wellness retreats.",
    totalEvents: 509, cities: 30, thisWeek: 44,
    subcategories: ["Yoga", "Meditation", "Fitness", "Nutrition", "Mental Health"],
  },
  technology: {
    label: "Technology", icon: Cpu,
    description: "Hackathons, meetups, AI events, and developer gatherings.",
    totalEvents: 387, cities: 24, thisWeek: 33,
    subcategories: ["Hackathons", "Meetups", "AI & ML", "Web Dev", "Startups"],
  },
  "kids-family": {
    label: "Kids & Family", icon: Baby,
    description: "Shows, activities, and experiences for the whole family.",
    totalEvents: 223, cities: 15, thisWeek: 19,
    subcategories: ["Shows", "Outdoor", "Indoor", "Workshops", "Storytelling"],
  },
  community: {
    label: "Community", icon: Users,
    description: "Charity runs, markets, volunteering, and local gatherings.",
    totalEvents: 194, cities: 21, thisWeek: 16,
    subcategories: ["Charity", "Markets", "Volunteering", "Fundraisers", "Local"],
  },
};

export const ALL_EVENTS_CONFIG = {
  label: "All Events", icon: Layers,
  description: "Explore thousands of events across every category and city.",
  totalEvents: 5442, cities: 60, thisWeek: 312,
  subcategories: [],
};

/* ═══════════════════════════════════════════════════════════════
   MASTER EVENTS POOL
   Shape matches API response. All sections filter from this pool.
   In production: swap getFilteredEvents() to real API calls.
═══════════════════════════════════════════════════════════════ */
export const EVENTS_POOL = [
  // ── MUSIC ──────────────────────────────────────────────────────
  { id: 1,  slug: "dhaka-jazz-festival-2025",   title: "Dhaka Jazz Festival 2025",         category: "music",        subCategory: "festivals",   eventType: "multi-day",      organizer: "Bangladesh Jazz Foundation", verified: true,  date: "Sat, Mar 15", time: "6:00 PM",  venue: "ICCB, Agargaon",              city: "dhaka",      price: 1200, priceLabel: "৳1,200", rating: 4.8, reviewCount: 124, attendees: 843,  capacity: 1000,  spotsLeft: 157,  trendScore: 88, featured: true,  image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80", tags: ["Jazz","Festival","Live Music"],    trendLabel: "📈 Rising",      reason: "Popular in your area",    distance: "2.4 km", newArrival: false, editorsPick: true },
  { id: 2,  slug: "synthwave-night-dhaka",      title: "Synthwave Night: Neon Dreams",     category: "music",        subCategory: "club-nights", eventType: "dj-sets",        organizer: "Noir Events",               verified: true,  date: "Fri, Mar 21", time: "9:00 PM",  venue: "Club Noir, Gulshan",          city: "dhaka",      price: 600,  priceLabel: "৳600",   rating: 4.6, reviewCount: 87,  attendees: 210,  capacity: 300,   spotsLeft: 90,   trendScore: 91, featured: false, image: "https://images.unsplash.com/photo-1571266028243-d220c6a6db90?w=800&q=80", tags: ["Electronic","Club","Neon"],        trendLabel: "📈 Rising",      reason: "Based on your interests", distance: "5.1 km", newArrival: true,  editorsPick: false },
  { id: 3,  slug: "rock-arena-2025",            title: "Rock Arena Bangladesh 2025",       category: "music",        subCategory: "concerts",    eventType: "live-bands",     organizer: "Arena Live",                verified: true,  date: "Sat, Mar 29", time: "5:00 PM",  venue: "Bangabandhu Stadium",         city: "dhaka",      price: 2500, priceLabel: "৳2,500", rating: 4.9, reviewCount: 312, attendees: 14500, capacity: 20000, spotsLeft: 5500, trendScore: 99, featured: true,  image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80", tags: ["Rock","Stadium","Concert"],        trendLabel: "🔥 Selling Fast", reason: "Top rated this month",    distance: "4.7 km", newArrival: false, editorsPick: true },
  { id: 4,  slug: "solo-acoustic-night",        title: "Solo Acoustic Night",              category: "music",        subCategory: "concerts",    eventType: "solo-artists",   organizer: "Acoustic Studio BD",        verified: false, date: "Thu, Mar 20", time: "8:00 PM",  venue: "The Alley, Dhanmondi",        city: "dhaka",      price: 400,  priceLabel: "৳400",   rating: 4.5, reviewCount: 48,  attendees: 80,   capacity: 120,   spotsLeft: 40,   trendScore: 60, featured: false, image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80", tags: ["Acoustic","Solo","Intimate"],      trendLabel: "🆕 New",          reason: "New this week",           distance: "1.8 km", newArrival: true,  editorsPick: false },
  { id: 5,  slug: "open-mic-friday",            title: "Friday Open Mic Dhaka",            category: "music",        subCategory: "open-mic",    eventType: "music",          organizer: "Stage Fright Events",       verified: false, date: "Fri, Mar 28", time: "7:00 PM",  venue: "Café Uprising, Dhanmondi",    city: "dhaka",      price: 0,    priceLabel: "Free",   rating: 4.4, reviewCount: 62,  attendees: 95,   capacity: 150,   spotsLeft: 55,   trendScore: 72, featured: false, image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&q=80", tags: ["Open Mic","Free","Community"],     trendLabel: "🔥 Selling Fast", reason: "Free events near you",    distance: "0.9 km", newArrival: false, editorsPick: false },
  { id: 6,  slug: "live-bands-showdown",        title: "Live Bands Showdown 2025",         category: "music",        subCategory: "concerts",    eventType: "live-bands",     organizer: "BandHub BD",                verified: true,  date: "Sat, Apr 5",  time: "6:00 PM",  venue: "Bashundhara City Arena",      city: "dhaka",      price: 1500, priceLabel: "৳1,500", rating: 4.8, reviewCount: 175, attendees: 2100, capacity: 3000,  spotsLeft: 900,  trendScore: 85, featured: true,  image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=80", tags: ["Live Bands","Rock","Competition"], trendLabel: "📈 Rising",      reason: "Popular with rock fans",  distance: "8.2 km", newArrival: false, editorsPick: true },
  { id: 7,  slug: "dhaka-music-weekend",        title: "Dhaka Music Weekend",              category: "music",        subCategory: "festivals",   eventType: "multi-day",      organizer: "SoundWave BD",              verified: true,  date: "Sat, Mar 22", time: "4:00 PM",  venue: "Hatirjheel Amphitheatre",     city: "dhaka",      price: 900,  priceLabel: "৳900",   rating: 4.7, reviewCount: 98,  attendees: 720,  capacity: 900,   spotsLeft: 180,  trendScore: 98, featured: true,  image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80", tags: ["Music","Outdoor","Weekend"],       trendLabel: "🔥 Selling Fast", reason: "Outdoor festival",        distance: "3.5 km", newArrival: false, editorsPick: false },
  { id: 8,  slug: "beats-bass-dhaka",           title: "Beats & Bass — Dhaka Edition",    category: "music",        subCategory: "club-nights", eventType: "dj-sets",        organizer: "Bassline Productions",      verified: true,  date: "Fri, Mar 28", time: "10:00 PM", venue: "Sky Lounge, Banani",          city: "dhaka",      price: 800,  priceLabel: "৳800",   rating: 4.5, reviewCount: 73,  attendees: 180,  capacity: 250,   spotsLeft: 70,   trendScore: 91, featured: false, image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80", tags: ["EDM","Bass","Club"],               trendLabel: "📈 Rising",      reason: "Trending in Dhaka",       distance: "6.0 km", newArrival: false, editorsPick: false },
  { id: 9,  slug: "acoustic-cafe-sessions",     title: "Acoustic Café Sessions Vol. 7",   category: "music",        subCategory: "concerts",    eventType: "solo-artists",   organizer: "Café Harmony",              verified: false, date: "Sun, Mar 23", time: "7:00 PM",  venue: "Café Harmony, Gulshan",       city: "dhaka",      price: 350,  priceLabel: "৳350",   rating: 4.6, reviewCount: 55,  attendees: 60,   capacity: 80,    spotsLeft: 20,   trendScore: 65, featured: false, image: "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=800&q=80", tags: ["Acoustic","Café","Intimate"],      trendLabel: "🆕 New",          reason: "Almost sold out",         distance: "5.5 km", newArrival: true,  editorsPick: false },
  { id: 10, slug: "live-bands-battle",          title: "Live Bands Battle Night",          category: "music",        subCategory: "concerts",    eventType: "live-bands",     organizer: "Rock Circuit BD",           verified: true,  date: "Sat, Apr 12", time: "6:00 PM",  venue: "Osmani Memorial Hall",        city: "dhaka",      price: 600,  priceLabel: "৳600",   rating: 4.8, reviewCount: 134, attendees: 850,  capacity: 1200,  spotsLeft: 350,  trendScore: 82, featured: false, image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=80", tags: ["Live Bands","Battle","Rock"],      trendLabel: "📈 Rising",      reason: "Editor's choice",         distance: "4.1 km", newArrival: false, editorsPick: true },
  // ── SPORTS ─────────────────────────────────────────────────────
  { id: 11, slug: "bd-premier-league-final",    title: "BD Premier League Final",          category: "sports",       subCategory: "football",    eventType: "league-matches", organizer: "BFF",                       verified: true,  date: "Fri, Mar 14", time: "7:00 PM",  venue: "Bangabandhu Stadium",         city: "dhaka",      price: 500,  priceLabel: "৳500",   rating: 4.7, reviewCount: 203, attendees: 18000, capacity: 20000, spotsLeft: 2000, trendScore: 97, featured: true,  image: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&q=80", tags: ["Football","League","Final"],       trendLabel: "🔥 Selling Fast", reason: "National event",          distance: "4.7 km", newArrival: false, editorsPick: true },
  { id: 12, slug: "dhaka-cricket-cup",          title: "Dhaka Premier Cricket Cup",        category: "sports",       subCategory: "cricket",     eventType: "t20",            organizer: "BCB",                       verified: true,  date: "Sun, Mar 30", time: "3:00 PM",  venue: "Sher-e-Bangla Stadium",       city: "dhaka",      price: 400,  priceLabel: "৳400",   rating: 4.8, reviewCount: 189, attendees: 22000, capacity: 26000, spotsLeft: 4000, trendScore: 96, featured: true,  image: "https://images.unsplash.com/photo-1540747913346-19212a4c3ae2?w=800&q=80", tags: ["Cricket","T20","Stadium"],         trendLabel: "🔥 Selling Fast", reason: "Top rated event",         distance: "7.2 km", newArrival: false, editorsPick: true },
  // ── ARTS & CULTURE ─────────────────────────────────────────────
  { id: 13, slug: "dhaka-theatre-gala",         title: "Dhaka Theatre Gala Night",         category: "arts-culture", subCategory: "theatre",     eventType: "drama",          organizer: "National Theatre BD",       verified: true,  date: "Sat, Mar 22", time: "7:30 PM",  venue: "National Theatre, Shahbag",   city: "dhaka",      price: 800,  priceLabel: "৳800",   rating: 4.7, reviewCount: 91,  attendees: 380,  capacity: 500,   spotsLeft: 120,  trendScore: 78, featured: true,  image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80", tags: ["Theatre","Drama","Culture"],       trendLabel: "📈 Rising",      reason: "Arts pick of the week",   distance: "3.2 km", newArrival: false, editorsPick: true },
  { id: 14, slug: "art-exhibition-dhaka",       title: "Contemporary Art Exhibition",      category: "arts-culture", subCategory: "exhibitions", eventType: "visual-art",     organizer: "Bengal Foundation",         verified: true,  date: "Sat, Mar 15", time: "10:00 AM", venue: "Bengal Arts Precinct, Gulshan",city: "dhaka",     price: 0,    priceLabel: "Free",   rating: 4.6, reviewCount: 67,  attendees: 520,  capacity: 1000,  spotsLeft: 480,  trendScore: 70, featured: false, image: "https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800&q=80", tags: ["Art","Exhibition","Free"],         trendLabel: "🆕 New",          reason: "Free admission",          distance: "5.8 km", newArrival: true,  editorsPick: false },
  // ── FOOD & DRINK ───────────────────────────────────────────────
  { id: 15, slug: "dhaka-food-fest-2025",       title: "Dhaka Food Festival 2025",         category: "food-drink",   subCategory: "pop-up",      eventType: "festival",       organizer: "Food BD Network",           verified: true,  date: "Fri, Apr 4",  time: "12:00 PM", venue: "Hatirjheel, Dhaka",           city: "dhaka",      price: 200,  priceLabel: "৳200",   rating: 4.7, reviewCount: 145, attendees: 3200, capacity: 5000,  spotsLeft: 1800, trendScore: 93, featured: true,  image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80", tags: ["Food","Festival","Outdoor"],       trendLabel: "🔥 Selling Fast", reason: "Most loved food event",   distance: "3.5 km", newArrival: false, editorsPick: true },
  // ── TECHNOLOGY ─────────────────────────────────────────────────
  { id: 16, slug: "dhaka-hackathon-2025",       title: "Dhaka Hackathon 2025",             category: "technology",   subCategory: "hackathons",  eventType: "competition",    organizer: "Tech BD Collective",        verified: true,  date: "Sat, Apr 5",  time: "9:00 AM",  venue: "BRAC University, Mohakhali",  city: "dhaka",      price: 0,    priceLabel: "Free",   rating: 4.8, reviewCount: 112, attendees: 540,  capacity: 800,   spotsLeft: 260,  trendScore: 89, featured: true,  image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80", tags: ["Hackathon","Tech","Free"],         trendLabel: "📈 Rising",      reason: "Developer community pick", distance: "9.1 km", newArrival: false, editorsPick: false },
  { id: 17, slug: "ai-summit-dhaka",            title: "AI & ML Summit Dhaka 2025",        category: "technology",   subCategory: "ai-ml",       eventType: "conference",     organizer: "DataBD",                    verified: true,  date: "Fri, Apr 11", time: "9:00 AM",  venue: "Pan Pacific Hotel, Kawran Bazar", city: "dhaka",   price: 2000, priceLabel: "৳2,000", rating: 4.9, reviewCount: 88,  attendees: 620,  capacity: 800,   spotsLeft: 180,  trendScore: 94, featured: true,  image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80", tags: ["AI","ML","Conference"],            trendLabel: "🔥 Selling Fast", reason: "Fastest growing event",   distance: "6.5 km", newArrival: false, editorsPick: true },
  // ── HEALTH ─────────────────────────────────────────────────────
  { id: 18, slug: "morning-yoga-dhaka",         title: "Morning Yoga in the Park",         category: "health",       subCategory: "yoga",        eventType: "class",          organizer: "Dhaka Yoga Studio",         verified: false, date: "Sun, Mar 16", time: "7:00 AM",  venue: "Ramna Park, Dhaka",           city: "dhaka",      price: 150,  priceLabel: "৳150",   rating: 4.5, reviewCount: 43,  attendees: 45,   capacity: 60,    spotsLeft: 15,   trendScore: 58, featured: false, image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80", tags: ["Yoga","Outdoor","Morning"],        trendLabel: "🆕 New",          reason: "Near your location",      distance: "0.6 km", newArrival: true,  editorsPick: false },
  // ── BUSINESS ───────────────────────────────────────────────────
  { id: 19, slug: "startup-summit-dhaka",       title: "Bangladesh Startup Summit 2025",   category: "business",     subCategory: "conferences", eventType: "summit",         organizer: "Startup BD",                verified: true,  date: "Thu, Apr 3",  time: "9:00 AM",  venue: "Radisson Blu Hotel, Dhaka",   city: "dhaka",      price: 3000, priceLabel: "৳3,000", rating: 4.8, reviewCount: 97,  attendees: 750,  capacity: 1000,  spotsLeft: 250,  trendScore: 87, featured: true,  image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80", tags: ["Startup","Business","Networking"], trendLabel: "📈 Rising",      reason: "Business community pick", distance: "7.8 km", newArrival: false, editorsPick: true },
  // ── OTHER CITIES ───────────────────────────────────────────────
  { id: 20, slug: "chittagong-rock-fest",       title: "Chittagong Rock Fest 2025",        category: "music",        subCategory: "festivals",   eventType: "outdoor",        organizer: "CTG Music Society",         verified: true,  date: "Sat, Apr 19", time: "5:00 PM",  venue: "MA Aziz Stadium, Chittagong", city: "chittagong", price: 1000, priceLabel: "৳1,000", rating: 4.9, reviewCount: 201, attendees: 4200, capacity: 6000,  spotsLeft: 1800, trendScore: 95, featured: true,  image: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80", tags: ["Rock","Festival","Chittagong"],    trendLabel: "🔥 Selling Fast", reason: "Top in Chittagong",       distance: "2.1 km", newArrival: false, editorsPick: true },
  { id: 21, slug: "sylhet-classical-night",     title: "Sylhet Classical Music Night",     category: "music",        subCategory: "concerts",    eventType: "live-bands",     organizer: "Sylhet Arts Council",       verified: true,  date: "Fri, Apr 11", time: "7:00 PM",  venue: "Osmani Museum Hall, Sylhet",  city: "sylhet",     price: 500,  priceLabel: "৳500",   rating: 4.7, reviewCount: 66,  attendees: 280,  capacity: 400,   spotsLeft: 120,  trendScore: 76, featured: false, image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&q=80", tags: ["Classical","Live","Sylhet"],       trendLabel: "📈 Rising",      reason: "Top in Sylhet",           distance: "1.3 km", newArrival: false, editorsPick: false },
  { id: 22, slug: "london-bd-music-night",      title: "Bangladesh Night London",          category: "music",        subCategory: "concerts",    eventType: "cultural",       organizer: "BD Cultural UK",            verified: true,  date: "Sat, Apr 26", time: "7:00 PM",  venue: "Troxy Theatre, London",       city: "london",     price: 1800, priceLabel: "৳1,800", rating: 4.8, reviewCount: 142, attendees: 820,  capacity: 1000,  spotsLeft: 180,  trendScore: 88, featured: true,  image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80", tags: ["Cultural","Bangladesh","London"],  trendLabel: "📈 Rising",      reason: "Popular in London",       distance: "3.4 km", newArrival: false, editorsPick: true },
  { id: 23, slug: "dubai-cultural-fest",        title: "South Asian Cultural Festival",    category: "arts-culture", subCategory: "exhibitions", eventType: "cultural",       organizer: "Dubai Cultural Centre",     verified: true,  date: "Thu, Apr 10", time: "5:00 PM",  venue: "Expo City Dubai",             city: "dubai",      price: 2200, priceLabel: "৳2,200", rating: 4.7, reviewCount: 113, attendees: 3400, capacity: 5000,  spotsLeft: 1600, trendScore: 91, featured: true,  image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80", tags: ["Cultural","Dubai","Arts"],         trendLabel: "🔥 Selling Fast", reason: "Popular in Dubai",        distance: "4.2 km", newArrival: false, editorsPick: false },
  // ── EDUCATION ──────────────────────────────────────────────────
  { id: 24, slug: "web-dev-bootcamp-dhaka",     title: "Full-Stack Web Dev Bootcamp",      category: "education",    subCategory: "boot-camps",  eventType: "workshop",       organizer: "Code Academy BD",           verified: true,  date: "Sat, Apr 5",  time: "9:00 AM",  venue: "Creative IT, Dhanmondi",      city: "dhaka",      price: 1500, priceLabel: "৳1,500", rating: 4.8, reviewCount: 76,  attendees: 28,   capacity: 40,    spotsLeft: 12,   trendScore: 80, featured: false, image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&q=80", tags: ["Coding","Web Dev","Workshop"],     trendLabel: "🆕 New",          reason: "Limited seats",           distance: "1.1 km", newArrival: true,  editorsPick: false },
  // ── COMMUNITY ──────────────────────────────────────────────────
  { id: 25, slug: "dhaka-charity-run-2025",     title: "Dhaka Charity Run 5K 2025",        category: "community",    subCategory: "charity",     eventType: "run",            organizer: "Run for Hope BD",           verified: true,  date: "Sun, Mar 23", time: "6:00 AM",  venue: "Hatirjheel, Dhaka",           city: "dhaka",      price: 300,  priceLabel: "৳300",   rating: 4.6, reviewCount: 88,  attendees: 1200, capacity: 2000,  spotsLeft: 800,  trendScore: 83, featured: false, image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80", tags: ["Charity","Run","Community"],       trendLabel: "📈 Rising",      reason: "Community favourite",     distance: "3.5 km", newArrival: false, editorsPick: false },
];

/* ═══════════════════════════════════════════════════════════════
   FILTER FACETS (mock counts for FiltersSection)
   In production: GET /api/events/facets?category=music&location=dhaka
═══════════════════════════════════════════════════════════════ */
export const FILTER_FACETS = {
  date:   { today: 23, tomorrow: 11, "this-week": 73, "this-weekend": 38, "this-month": 142, "next-month": 89 },
  price:  { free: 56, "under-500": 134, "500-1000": 98, "1000-2500": 61, "2500-plus": 27 },
  format: { "in-person": 241, online: 89, hybrid: 46 },
  time:   { morning: 34, afternoon: 67, evening: 112, night: 63 },
};

/* ═══════════════════════════════════════════════════════════════
   REVIEWS POOL
   In production: GET /api/reviews?category=music&location=dhaka&limit=6
═══════════════════════════════════════════════════════════════ */
export const REVIEWS_POOL = [
  { id: 1, eventId: 3, eventTitle: "Rock Arena Bangladesh 2025",  category: "music", city: "dhaka", reviewer: "Rafiq Islam",    avatar: "RI", rating: 5, date: "2025-03-03T10:00:00Z", text: "Absolutely incredible energy! Rock Arena was everything I hoped for — the sound was massive, the lineup was legendary, and the crowd was electric. Best night of the year so far.",         helpful: 42, eventSlug: "rock-arena-2025" },
  { id: 2, eventId: 7, eventTitle: "Dhaka Music Weekend",         category: "music", city: "dhaka", reviewer: "Priya Chowdhury",avatar: "PC", rating: 5, date: "2025-02-25T15:30:00Z", text: "Dhaka Music Weekend delivered on every front. The outdoor setting at Hatirjheel was stunning, the curation was thoughtful, and the vibe was just perfect. Already looking forward to next year!", helpful: 38, eventSlug: "dhaka-music-weekend" },
  { id: 3, eventId: 1, eventTitle: "Dhaka Jazz Festival 2025",    category: "music", city: "dhaka", reviewer: "Tanvir Ahmed",    avatar: "TA", rating: 4, date: "2025-02-18T09:15:00Z", text: "The Jazz Festival was a beautiful, intimate experience. Musicians from across the country showed up and delivered stunning sets. The venue at ICCB was perfect for the mood.",                helpful: 27, eventSlug: "dhaka-jazz-festival-2025" },
  { id: 4, eventId: 11, eventTitle: "BD Premier League Final",    category: "sports", city: "dhaka", reviewer: "Karim Hossain",  avatar: "KH", rating: 5, date: "2025-03-01T20:00:00Z", text: "The atmosphere at Bangabandhu Stadium was unreal. Thousands of fans, incredible play, a last-minute winner — this is why we love football! Tickets sold out fast, get yours early!",         helpful: 61, eventSlug: "bd-premier-league-final" },
  { id: 5, eventId: 13, eventTitle: "Dhaka Theatre Gala Night",   category: "arts-culture", city: "dhaka", reviewer: "Nasrin Begum", avatar: "NB", rating: 5, date: "2025-02-20T11:45:00Z", text: "The Theatre Gala was a genuinely moving experience — superb acting, beautiful staging, and a story that stayed with me for days. Theatre like this is a reminder of why live art matters.", helpful: 33, eventSlug: "dhaka-theatre-gala" },
  { id: 6, eventId: 17, eventTitle: "AI & ML Summit Dhaka 2025",  category: "technology", city: "dhaka", reviewer: "Sadia Islam",  avatar: "SI", rating: 5, date: "2025-03-05T14:20:00Z", text: "The AI Summit was world-class. The speakers were practitioners at the cutting edge, the workshops were hands-on, and the networking opportunities were invaluable. A must for tech professionals.", helpful: 55, eventSlug: "ai-summit-dhaka" },
];

/* ═══════════════════════════════════════════════════════════════
   PLATFORM STATS
   In production: GET /api/stats?category=music&location=dhaka
═══════════════════════════════════════════════════════════════ */
export const PLATFORM_STATS = {
  root:        { events: 5442, organizers: 312, cities: 60, ticketsSold: 48200, avgRating: 4.7 },
  music:       { events: 1284, organizers: 98,  cities: 48, ticketsSold: 18400, avgRating: 4.8 },
  sports:      { events: 894,  organizers: 54,  cities: 32, ticketsSold: 12100, avgRating: 4.7 },
  "arts-culture": { events: 642, organizers: 67, cities: 27, ticketsSold: 6800, avgRating: 4.6 },
  "food-drink":   { events: 431, organizers: 41, cities: 19, ticketsSold: 5200, avgRating: 4.7 },
  business:    { events: 318,  organizers: 38,  cities: 22, ticketsSold: 4400, avgRating: 4.6 },
  education:   { events: 276,  organizers: 29,  cities: 18, ticketsSold: 3800, avgRating: 4.7 },
  health:      { events: 509,  organizers: 45,  cities: 30, ticketsSold: 7100, avgRating: 4.5 },
  technology:  { events: 387,  organizers: 43,  cities: 24, ticketsSold: 5900, avgRating: 4.8 },
  "kids-family":  { events: 223, organizers: 24, cities: 15, ticketsSold: 3100, avgRating: 4.6 },
  community:   { events: 194,  organizers: 31,  cities: 21, ticketsSold: 2900, avgRating: 4.5 },
};
