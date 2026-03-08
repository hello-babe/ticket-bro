'use strict';
const asyncHandler = require('../../common/utils/asyncHandler');
const { sendSuccess, sendCreated } = require('../../common/utils/apiResponse');

class CartController {
  getCart        = asyncHandler(async (req, res) => { sendSuccess(res, 'Cart fetched.', { items: [], total: 0, discount: 0 }); });
  addItem        = asyncHandler(async (req, res) => { sendSuccess(res, 'Item added.', { items: [req.body], total: req.body.price || 0 }); });
  updateItem     = asyncHandler(async (req, res) => { sendSuccess(res, 'Item updated.', { itemId: req.params.itemId }); });
  removeItem     = asyncHandler(async (req, res) => { sendSuccess(res, 'Item removed.'); });
  clearCart      = asyncHandler(async (req, res) => { sendSuccess(res, 'Cart cleared.'); });
  applyPromo     = asyncHandler(async (req, res) => { sendSuccess(res, 'Promo applied.', { discount: 10, code: req.body.code }); });
  removePromo    = asyncHandler(async (req, res) => { sendSuccess(res, 'Promo removed.'); });
  checkout       = asyncHandler(async (req, res) => { sendCreated(res, 'Checkout initiated.', { orderId: `ORD-${Date.now()}` }); });
}
module.exports = new CartController();
