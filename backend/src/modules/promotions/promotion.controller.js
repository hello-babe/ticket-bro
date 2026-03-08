'use strict';
const asyncHandler = require('../../common/utils/asyncHandler');
const { sendSuccess, sendCreated } = require('../../common/utils/apiResponse');
class PromotionController {
  validateCode    = asyncHandler(async (req, res) => {
    const { code } = req.body;
    if (code === 'SAVE10') return sendSuccess(res, 'Valid promo code.', { code, discount: 10, type: 'percent', valid: true });
    return res.status(400).json({ success: false, message: 'Invalid or expired promo code.' });
  });
  create          = asyncHandler(async (req, res) => { sendCreated(res, 'Promotion created.', { id: `promo_${Date.now()}`, ...req.body }); });
  getMyPromotions = asyncHandler(async (req, res) => { sendSuccess(res, 'Promotions fetched.', { promotions: [] }); });
  update          = asyncHandler(async (req, res) => { sendSuccess(res, 'Promotion updated.', { id: req.params.id, ...req.body }); });
  remove          = asyncHandler(async (req, res) => { sendSuccess(res, 'Promotion deleted.'); });
}
module.exports = new PromotionController();
