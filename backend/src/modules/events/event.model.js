// src/events/event.model.js
'use strict';
const mongoose = require('mongoose');

// ── Helper: safe slugify ─────────────────────────────
const toSlug = (str) => str.toLowerCase().trim()
  .replace(/[^\w\s-]/g, '')
  .replace(/[\s_-]+/g, '-')
  .replace(/^-+|-+$/g, '');

// ── Event Status Enum ───────────────────────────────
const EVENT_STATUS = Object.freeze({
  DRAFT: 'draft',
  PENDING: 'pending',
  PUBLISHED: 'published',
  CANCELLED: 'cancelled',
  POSTPONED: 'postponed',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
});

// ── Location Sub-Schema ─────────────────────────────
const locationSchema = new mongoose.Schema({
  type: { type: String, enum: ['online', 'physical'], default: 'physical' },
  name: { type: String, trim: true },
  address: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  country: { type: String, trim: true, default: 'Bangladesh' },
  zip: { type: String, trim: true },
  lat: { type: Number },
  lng: { type: Number },
  onlineUrl: { type: String, trim: true },
}, { _id: false });

// ── Event Schema ───────────────────────────────────
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, minlength: 3, maxlength: 200 },
  slug: { type: String, unique: true, lowercase: true, index: true },
  description: { type: String, required: true, trim: true, maxlength: 10000 },
  shortDescription: { type: String, trim: true, maxlength: 500 },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  coverImage: { type: String, trim: true },
  images: [{ type: String, trim: true }],
  videoUrl: { type: String, trim: true },

  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true },
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' },
  eventType: { type: mongoose.Schema.Types.ObjectId, ref: 'EventType' },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],

  startDate: { type: Date, required: true, index: true },
  endDate: { type: Date, required: true },
  timezone: { type: String, default: 'Asia/Dhaka' },
  isRecurring: { type: Boolean, default: false },
  location: { type: locationSchema },

  // References to separate ticket and seat models
  tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }],
  seats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Seat' }],

  // Pricing summary
  isFree: { type: Boolean, default: false },
  minPrice: { type: Number, default: 0, min: 0 },
  maxPrice: { type: Number, default: 0, min: 0 },
  currency: { type: String, default: 'BDT' },

  totalCapacity: { type: Number, min: 0 },
  totalSold: { type: Number, default: 0, min: 0 },

  // Status & visibility
  status: { type: String, enum: Object.values(EVENT_STATUS), default: EVENT_STATUS.DRAFT, index: true },
  isFeatured: { type: Boolean, default: false, index: true },
  isTrending: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  rejectionReason: { type: String, trim: true },
  publishedAt: { type: Date },
  cancelledAt: { type: Date },

  // Analytics
  viewCount: { type: Number, default: 0 },
  likeCount: { type: Number, default: 0 },
  bookmarkCount: { type: Number, default: 0 },
  shareCount: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },

  deletedAt: { type: Date, default: null, index: true },

}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// ── Indexes ───────────────────────────────────────
eventSchema.index({ startDate: 1, status: 1 });
eventSchema.index({ organizer: 1, status: 1 });
eventSchema.index({ isFeatured: 1, status: 1 });
eventSchema.index({ 'location.city': 1, startDate: 1 });
eventSchema.index({ title: 'text', description: 'text', shortDescription: 'text' });

// ── Slug auto-generation ───────────────────────────
eventSchema.pre('save', async function(next) {
  if (!this.isModified('title') && this.slug) return next();

  let base = toSlug(this.title);
  let slug = base;
  let i = 1;

  while (await this.constructor.exists({ slug, _id: { $ne: this._id } })) {
    slug = `${base}-${i++}`;
  }
  this.slug = slug;
  next();
});

// ── Virtuals ──────────────────────────────────────
eventSchema.virtual('isUpcoming').get(function() { return this.startDate > new Date(); });
eventSchema.virtual('isPast').get(function() { return this.endDate < new Date(); });
eventSchema.virtual('soldPercentage').get(function() {
  if (!this.totalCapacity) return 0;
  return Math.round((this.totalSold / this.totalCapacity) * 100);
});

// ── Statics ───────────────────────────────────────
eventSchema.statics.EVENT_STATUS = EVENT_STATUS;
eventSchema.statics.published = function() {
  return this.where({ status: EVENT_STATUS.PUBLISHED, deletedAt: null });
};

// ── Model ─────────────────────────────────────────
const Event = mongoose.model('Event', eventSchema);
module.exports = Event;