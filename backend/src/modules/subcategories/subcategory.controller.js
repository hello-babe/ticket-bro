'use strict';
const asyncHandler = require('../../common/utils/asyncHandler');
const { sendSuccess, sendCreated } = require('../../common/utils/apiResponse');
class SubcategoryController {
  getAll    = asyncHandler(async (req, res) => { sendSuccess(res, 'Subcategories fetched.', { subcategories: [] }); });
  getBySlug = asyncHandler(async (req, res) => { sendSuccess(res, 'Subcategory fetched.', { slug: req.params.slug }); });
  create    = asyncHandler(async (req, res) => { sendCreated(res, 'Subcategory created.', req.body); });
  update    = asyncHandler(async (req, res) => { sendSuccess(res, 'Subcategory updated.', { slug: req.params.slug, ...req.body }); });
  remove    = asyncHandler(async (req, res) => { sendSuccess(res, 'Subcategory deleted.'); });
}
module.exports = new SubcategoryController();
