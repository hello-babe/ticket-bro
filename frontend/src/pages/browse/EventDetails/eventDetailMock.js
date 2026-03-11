/**
 * eventDetailMock.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Single full mock event that matches normaliseEvent() output shape.
 * Every field maps to event.model.js.
 *
 * Production replacement:
 *   Delete this file and update EventDetailsPage to use:
 *     const { event, isLoading, notFound } = useEventDetails(eventSlug);
 * ─────────────────────────────────────────────────────────────────────────────
 */

const MOCK_EVENT = {
  // ── Identity (event.model.js core identity) ─────────────────────────────
  _id:              "event_rock_arena_2025",
  id:               "event_rock_arena_2025",
  slug:             "rock-arena-2025",
  title:            "Rock Arena Bangladesh 2025",
  description:      `Rock Arena Bangladesh 2025 is the country's most anticipated rock concert, bringing together the finest rock bands from across Bangladesh and the region for one unforgettable night at Bangabandhu National Stadium.

From the raw energy of heavy metal to the melodic storytelling of indie rock, this event is a celebration of everything that makes rock music timeless. With a state-of-the-art stage, world-class sound and lighting, and a passionate crowd of over 20,000 fans, this is more than a concert — it's a movement.

Whether you've been following Bangladesh's rock scene for decades or you're discovering it for the first time, Rock Arena 2025 promises a night you will never forget. Featuring 5 headline acts, professional stage production, exclusive merchandise, and live streaming for fans worldwide.`,
  shortDescription: "Bangladesh's biggest rock concert. 5 headline bands. 20,000 fans. One unforgettable night.",

  // ── Ownership ────────────────────────────────────────────────────────────
  organizer: {
    _id: "user_arena_live",
    name: "Arena Live",
    username: "arenalive_bd",
    slug: "arena-live",
    isVerified: true,
    bio: "Bangladesh's premier live event production company, bringing world-class concerts and experiences to audiences across the country since 2015.",
    totalEvents: 48,
    totalAttendees: 120000,
    averageRating: 4.9,
    reviewCount: 842,
    website: "https://arenalive.bd",
    phone: "+880 1700 000000",
    email: "hello@arenalive.bd",
    socials: {
      instagram: "arenalive_bd",
      facebook:  "arenalivebd",
      twitter:   "arenalive_bd",
      youtube:   "AreneLiveBD",
    },
  },
  organizerProfile: null,
  coOrganizers: [],

  // ── Media ────────────────────────────────────────────────────────────────
  coverImage: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1400&q=80",
  images: [
    "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1400&q=80",
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1400&q=80",
    "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1400&q=80",
    "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1400&q=80",
  ],
  videoUrl: null,
  thumbnail: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&q=60",

  // ── Taxonomy (populated refs → {_id, slug, name}) ───────────────────────
  category:    { _id: "cat_music",    slug: "music",       name: "Music"       },
  subcategory: { _id: "sub_concerts", slug: "concerts",    name: "Concerts"    },
  eventType:   { _id: "et_live",      slug: "live-bands",  name: "Live Bands"  },
  tags: [
    { _id: "t1", name: "Rock"        },
    { _id: "t2", name: "Live Music"  },
    { _id: "t3", name: "Stadium"     },
    { _id: "t4", name: "Bangladesh"  },
    { _id: "t5", name: "Concert"     },
  ],

  // ── Schedule ─────────────────────────────────────────────────────────────
  startDate: new Date("2025-03-29T17:00:00+06:00"),
  endDate:   new Date("2025-03-29T23:00:00+06:00"),
  timezone:  "Asia/Dhaka",
  doorsOpen: new Date("2025-03-29T16:00:00+06:00"),
  isRecurring: false,
  recurrence:  null,
  parentEvent: null,
  durationMinutes: 360,

  // agenda[] — maps to agendaItemSchema
  agenda: [],

  // UI-only schedule (used when agenda is empty)
  schedule: [
    { time: "4:00 PM", title: "Gates Open",    description: "Entry begins. Merchandise stalls open." },
    { time: "5:00 PM", title: "Warfaze",        description: "Opening performance. Hard rock classics." },
    { time: "5:45 PM", title: "Nemesis",        description: "Post grunge set. Fan favourites." },
    { time: "6:45 PM", title: "Shironamhin",    description: "Special guest performance." },
    { time: "7:30 PM", title: "Intermission",   description: "30-min break. Food & beverage stalls." },
    { time: "8:00 PM", title: "Cryptic Fate",   description: "Co-headliner heavy metal set." },
    { time: "9:30 PM", title: "Arbovirus",      description: "Headline performance. Full production show." },
    { time: "11:00 PM", title: "Event Ends",    description: "Encore & crowd farewell." },
  ],

  // ── Location (locationSchema) ────────────────────────────────────────────
  location: {
    type:           "physical",
    typeLabel:      "In Person",
    name:           "Bangabandhu National Stadium",
    address:        "Motijheel",
    city:           "Dhaka",
    state:          "Dhaka Division",
    country:        "Bangladesh",
    zip:            "1000",
    addressLabel:   "Bangabandhu National Stadium, Motijheel, Dhaka 1000, Bangladesh",
    isOnline:       false,
    isHybrid:       false,
    latLng:         { lat: 23.7379, lng: 90.3964 },
    onlineUrl:      null,
    onlinePlatform: null,
    streamPassword: null,
  },

  // ── Pricing ──────────────────────────────────────────────────────────────
  isFree:     false,
  minPrice:   1500,
  maxPrice:   10000,
  currency:   "BDT",
  priceLabel: "BDT 1,500 – 10,000",

  // ── Capacity ─────────────────────────────────────────────────────────────
  totalCapacity: 20000,
  totalSold:     14500,
  totalReserved: 500,
  spotsLeft:     5000,
  soldPercentage: 73,
  isSoldOut:     false,

  // ── Tickets (populated Ticket refs) ──────────────────────────────────────
  tickets: [
    { id: "general", label: "General",  price: 1500,  currency: "BDT", available: true,
      perks: ["Standing area", "Basic entry", "Merchandise access"] },
    { id: "silver",  label: "Silver",   price: 2500,  currency: "BDT", available: true,
      perks: ["Reserved seating", "Priority entry", "Complimentary water"] },
    { id: "gold",    label: "Gold",     price: 5000,  currency: "BDT", available: true,
      perks: ["Premium seating", "Backstage pass", "Meet & greet", "F&B included"] },
    { id: "vip",     label: "VIP",      price: 10000, currency: "BDT", available: false,
      perks: ["Front row", "Full backstage", "Private lounge", "All inclusive"] },
  ],

  // ── Status & visibility ──────────────────────────────────────────────────
  status:          "published",
  statusLabel:     "Published",
  statusColor:     "success",
  visibility:      "public",
  visibilityLabel: "Public",
  ageRestriction:  "all",
  ageLabel:        "All Ages",

  // ── Flags ────────────────────────────────────────────────────────────────
  isFeatured:       true,
  isTrending:       true,
  isVerified:       true,
  isSponsored:      true,
  requiresApproval: false,

  // ── Virtuals / computed ───────────────────────────────────────────────────
  isUpcoming:   true,
  isOngoing:    false,
  isPast:       false,
  canPurchase:  true,
  canReview:    false,
  canCancel:    true,

  // ── Analytics ────────────────────────────────────────────────────────────
  viewCount:      48000,
  uniqueViewCount:31000,
  likeCount:      3200,
  bookmarkCount:  1840,
  shareCount:     920,
  reviewCount:    312,
  averageRating:  4.9,
  trendScore:     99,

  // ── Lineup (UI-only — production: fetch from /artists API) ───────────────
  lineup: [
    { id: 1, name: "Arbovirus",    role: "Headliner",    genre: "Rock / Alternative", time: "9:30 PM",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=200&q=80",  avatar: "AR" },
    { id: 2, name: "Cryptic Fate", role: "Co-Headliner", genre: "Heavy Metal",         time: "8:00 PM",
      image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=200&q=80",  avatar: "CF" },
    { id: 3, name: "Shironamhin",  role: "Special Guest",genre: "Alternative Rock",    time: "6:45 PM",
      image: "https://images.unsplash.com/photo-1571266028243-d220c6a6db90?w=200&q=80",  avatar: "SH" },
    { id: 4, name: "Nemesis",      role: "Supporting",   genre: "Post Grunge",          time: "5:45 PM",
      image: "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=200&q=80",  avatar: "NE" },
    { id: 5, name: "Warfaze",      role: "Opening Act",  genre: "Hard Rock",            time: "5:00 PM",
      image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=200&q=80",  avatar: "WF" },
  ],

  // ── FAQs (faqItemSchema) ─────────────────────────────────────────────────
  faqs: [
    { _id: "f1", question: "What is the age restriction?",
      answer: "This is an all-ages event. Children under 5 enter free with a paying adult." },
    { _id: "f2", question: "Can I bring my own food or drinks?",
      answer: "Outside food and beverages are not permitted. Multiple F&B stalls will be available on site throughout the event." },
    { _id: "f3", question: "Is re-entry allowed?",
      answer: "Re-entry is not permitted once you exit the venue. Please plan accordingly." },
    { _id: "f4", question: "Are tickets refundable?",
      answer: "All ticket sales are final. However, tickets may be transferred to another person via the app up to 2 hours before the event." },
    { _id: "f5", question: "What should I bring?",
      answer: "Please bring your ticket (digital or printed), a valid photo ID, and arrive early to avoid queues at entry." },
    { _id: "f6", question: "Is there parking available?",
      answer: "Limited parking is available. We strongly recommend using public transport or ride-sharing services." },
  ],

  // ── Sponsors (sponsorSchema) ─────────────────────────────────────────────
  sponsors: [
    { _id: "s1", name: "Robi Axiata",      tier: "platinum", logo: null, url: "https://robi.com.bd" },
    { _id: "s2", name: "bKash",            tier: "gold",     logo: null, url: "https://bkash.com"   },
    { _id: "s3", name: "Bashundhara",      tier: "silver",   logo: null, url: "#" },
    { _id: "s4", name: "Daily Star",       tier: "partner",  logo: null, url: "https://thedailystar.net" },
    { _id: "s5", name: "Grameenphone",     tier: "gold",     logo: null, url: "https://grameenphone.com" },
  ],

  // ── Policies ─────────────────────────────────────────────────────────────
  refundPolicy: {
    allowRefunds:   false,
    cutoffHours:    24,
    percentageBack: 0,
    notes:          "All ticket sales are final. Tickets may be transferred.",
  },
  termsAndConditions: null,
  dressCode:          "Casual",
  accessibilityInfo:  "Wheelchair accessible entry at Gate 3. Accessible restrooms available.",

  // ── SEO ──────────────────────────────────────────────────────────────────
  seo: {
    metaTitle:       "Rock Arena Bangladesh 2025 | Ticket Bro",
    metaDescription: "Bangladesh's biggest rock concert. 5 headline bands including Arbovirus, Cryptic Fate & Shironamhin. March 29 at Bangabandhu National Stadium.",
    keywords:        ["rock concert dhaka", "bangladesh live music", "arbovirus", "cryptic fate"],
  },

  // ── Timestamps ───────────────────────────────────────────────────────────
  createdAt:   new Date("2025-01-10T08:00:00Z"),
  updatedAt:   new Date("2025-03-01T12:00:00Z"),
  publishedAt: new Date("2025-01-15T10:00:00Z"),
  cancelledAt: null,
};

export default MOCK_EVENT;
