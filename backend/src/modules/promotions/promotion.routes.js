'use strict';
const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../common/middleware/auth.middleware');
const { ROLES } = require('../../common/constants/roles');
let _c; const c = () => { if (!_c) _c = require('./promotion.controller'); return _c; };

router.post('/validate',      authenticate, (req,res,next) => c().validateCode(req,res,next));
router.post('/organizer',     authenticate, authorize(ROLES.ORGANIZER,ROLES.ADMIN,ROLES.SUPER_ADMIN), (req,res,next) => c().create(req,res,next));
router.get('/organizer',      authenticate, authorize(ROLES.ORGANIZER,ROLES.ADMIN,ROLES.SUPER_ADMIN), (req,res,next) => c().getMyPromotions(req,res,next));
router.put('/organizer/:id',  authenticate, authorize(ROLES.ORGANIZER,ROLES.ADMIN,ROLES.SUPER_ADMIN), (req,res,next) => c().update(req,res,next));
router.delete('/organizer/:id',authenticate, authorize(ROLES.ORGANIZER,ROLES.ADMIN,ROLES.SUPER_ADMIN), (req,res,next) => c().remove(req,res,next));
module.exports = router;
