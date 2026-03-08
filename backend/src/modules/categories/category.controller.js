'use strict';
const asyncHandler = require('../../common/utils/asyncHandler');
const { sendSuccess, sendCreated } = require('../../common/utils/apiResponse');

const SAMPLE_CATEGORIES = [
  { slug: 'concerts', name: 'Concerts', icon: '🎵', description: 'Live music performances', count: 156 },
  { slug: 'sports', name: 'Sports', icon: '🏆', description: 'Sports events and matches', count: 89 },
  { slug: 'theater', name: 'Theater', icon: '🎭', description: 'Broadway and theatrical shows', count: 45 },
  { slug: 'comedy', name: 'Comedy', icon: '😂', description: 'Comedy shows', count: 34 },
  { slug: 'festivals', name: 'Festivals', icon: '🎪', description: 'Music and cultural festivals', count: 23 },
  { slug: 'family', name: 'Family', icon: '👨‍👩‍👧‍👦', description: 'Family events', count: 67 },
];

class CategoryController {
  getAll          = asyncHandler(async (req, res) => { sendSuccess(res, 'Categories fetched.', { categories: SAMPLE_CATEGORIES }); });
  getBySlug       = asyncHandler(async (req, res) => {
    const cat = SAMPLE_CATEGORIES.find(c => c.slug === req.params.slug);
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found.' });
    sendSuccess(res, 'Category fetched.', { category: cat });
  });
  getSubcategories= asyncHandler(async (req, res) => { sendSuccess(res, 'Subcategories fetched.', { subcategories: [] }); });
  create          = asyncHandler(async (req, res) => { sendCreated(res, 'Category created.', { slug: req.body.name?.toLowerCase(), ...req.body }); });
  update          = asyncHandler(async (req, res) => { sendSuccess(res, 'Category updated.', { slug: req.params.slug, ...req.body }); });
  remove          = asyncHandler(async (req, res) => { sendSuccess(res, 'Category deleted.'); });
}
module.exports = new CategoryController();
