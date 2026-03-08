'use strict';
const express = require('express');
const router = express.Router();
const { authorize } = require('../../common/middleware/auth.middleware');
const { ROLES } = require('../../common/constants/roles');
let _c; const c = () => { if (!_c) _c = require('./payment.controller'); return _c; };

router.post('/intent',             (req,res,next) => c().createIntent(req,res,next));
router.post('/verify',             (req,res,next) => c().verifyPayment(req,res,next));
router.get('/',                    (req,res,next) => c().getMyPayments(req,res,next));
router.get('/methods',             (req,res,next) => c().getPaymentMethods(req,res,next));
router.delete('/methods/:id',      (req,res,next) => c().removePaymentMethod(req,res,next));
router.get('/:id',                 (req,res,next) => c().getPaymentById(req,res,next));
router.post('/:id/refund',         (req,res,next) => c().requestRefund(req,res,next));
router.get('/:id/refund',          (req,res,next) => c().getRefundStatus(req,res,next));
module.exports = router;
