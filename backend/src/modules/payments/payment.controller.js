'use strict';
const asyncHandler = require('../../common/utils/asyncHandler');
const { sendSuccess, sendCreated } = require('../../common/utils/apiResponse');

class PaymentController {
  createIntent       = asyncHandler(async (req, res) => { sendCreated(res, 'Payment intent created.', { clientSecret: `pi_${Date.now()}_secret`, amount: req.body.amount }); });
  verifyPayment      = asyncHandler(async (req, res) => { sendSuccess(res, 'Payment verified.', { paymentId: req.body.paymentIntentId, status: 'succeeded' }); });
  getMyPayments      = asyncHandler(async (req, res) => { sendSuccess(res, 'Payments fetched.', { payments: [] }); });
  getPaymentById     = asyncHandler(async (req, res) => { sendSuccess(res, 'Payment fetched.', { id: req.params.id }); });
  requestRefund      = asyncHandler(async (req, res) => { sendSuccess(res, 'Refund requested.', { id: req.params.id }); });
  getRefundStatus    = asyncHandler(async (req, res) => { sendSuccess(res, 'Refund status.', { id: req.params.id, status: 'pending' }); });
  getPaymentMethods  = asyncHandler(async (req, res) => { sendSuccess(res, 'Payment methods.', { methods: [] }); });
  removePaymentMethod= asyncHandler(async (req, res) => { sendSuccess(res, 'Method removed.'); });
}
module.exports = new PaymentController();
