'use strict';
const asyncHandler = require('../../common/utils/asyncHandler');
const { sendSuccess, sendCreated } = require('../../common/utils/apiResponse');

class ReviewController {
  getEventReviews = asyncHandler(async (req, res) => { sendSuccess(res, 'Reviews fetched.', { reviews: [], total: 0 }); });
  getReviewSummary= asyncHandler(async (req, res) => { sendSuccess(res, 'Summary fetched.', { average: 0, total: 0, breakdown: {} }); });
  createReview    = asyncHandler(async (req, res) => { sendCreated(res, 'Review submitted.', { id: `rev_${Date.now()}`, ...req.body }); });
  getMyReviews    = asyncHandler(async (req, res) => { sendSuccess(res, 'Your reviews.', { reviews: [] }); });
  updateReview    = asyncHandler(async (req, res) => { sendSuccess(res, 'Review updated.', { id: req.params.id }); });
  deleteReview    = asyncHandler(async (req, res) => { sendSuccess(res, 'Review deleted.'); });
}
module.exports = new ReviewController();
