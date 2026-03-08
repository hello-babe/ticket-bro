'use strict';
const asyncHandler = require('../../common/utils/asyncHandler');
const { sendSuccess } = require('../../common/utils/apiResponse');
const TAGS = ['pop','rock','hip-hop','jazz','classical','sports','theater','comedy','festival','family','outdoor','indoor'];
class TagController {
  getAll    = asyncHandler(async (req, res) => { sendSuccess(res, 'Tags fetched.', { tags: TAGS.map(t => ({ slug: t, name: t })) }); });
  getPopular= asyncHandler(async (req, res) => { sendSuccess(res, 'Popular tags.', { tags: TAGS.slice(0,6).map(t => ({ slug: t, name: t })) }); });
  getBySlug = asyncHandler(async (req, res) => { sendSuccess(res, 'Tag fetched.', { tag: { slug: req.params.slug, name: req.params.slug } }); });
}
module.exports = new TagController();
