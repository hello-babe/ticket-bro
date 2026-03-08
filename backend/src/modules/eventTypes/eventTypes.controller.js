'use strict';
const asyncHandler = require('../../common/utils/asyncHandler');
const { sendSuccess, sendCreated } = require('../../common/utils/apiResponse');
class EventTypeController {
  getAll    = asyncHandler(async (req, res) => { sendSuccess(res, 'Event types fetched.', { eventTypes: [] }); });
  getBySlug = asyncHandler(async (req, res) => { sendSuccess(res, 'Event type fetched.', { slug: req.params.slug }); });
  create    = asyncHandler(async (req, res) => { sendCreated(res, 'Event type created.', req.body); });
  update    = asyncHandler(async (req, res) => { sendSuccess(res, 'Event type updated.', req.body); });
  remove    = asyncHandler(async (req, res) => { sendSuccess(res, 'Event type deleted.'); });
}
module.exports = new EventTypeController();
