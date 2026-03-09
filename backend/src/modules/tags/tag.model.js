// src/tags/tag.model.js
'use strict';
const mongoose = require('mongoose');

// Helper: safe slugify
const toSlug = (str) => str.toLowerCase().trim()
  .replace(/[^\w\s-]/g, '')
  .replace(/[\s_-]+/g, '-')
  .replace(/^-+|-+$/g, '');

const tagSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  slug: { type: String, unique: true, lowercase: true, index: true },
  description: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
  deletedAt: { type: Date, default: null, index: true },
}, { timestamps: true });

tagSchema.pre('save', async function(next) {
  if (!this.isModified('name') && this.slug) return next();

  let base = toSlug(this.name);
  let slug = base;
  let i = 1;

  while (await this.constructor.exists({ slug, _id: { $ne: this._id } })) {
    slug = `${base}-${i++}`;
  }
  this.slug = slug;
  next();
});

tagSchema.virtual('isDeleted').get(function() {
  return !!this.deletedAt;
});

const Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;