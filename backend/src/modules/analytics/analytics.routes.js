'use strict';
const express = require('express');
const router = express.Router();
const { authorize } = require('../../common/middleware/auth.middleware');
const { ROLES } = require('../../common/constants/roles');
let _c; const c = () => { if (!_c) _c = require('./analytics.controller'); return _c; };

// Organizer analytics (authenticate applied in routes.js)
router.get('/overview',           (req,res,next) => c().getOverview(req,res,next));
router.get('/revenue',            (req,res,next) => c().getRevenue(req,res,next));
router.get('/tickets',            (req,res,next) => c().getTicketStats(req,res,next));
router.get('/events',             (req,res,next) => c().getEventStats(req,res,next));
router.get('/events/:id',         (req,res,next) => c().getEventAnalytics(req,res,next));
router.get('/audience',           (req,res,next) => c().getAudience(req,res,next));
module.exports = router;
