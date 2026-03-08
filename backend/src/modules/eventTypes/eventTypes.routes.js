'use strict';
const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../common/middleware/auth.middleware');
const { cache } = require('../../common/middleware/cache.middleware');
const { ROLES } = require('../../common/constants/roles');
let _c; const c = () => { if (!_c) _c = require('./eventTypes.controller'); return _c; };

router.get('/',       cache('10m'), (req,res,next) => c().getAll(req,res,next));
router.post('/',      authenticate, authorize(ROLES.ADMIN,ROLES.SUPER_ADMIN), (req,res,next) => c().create(req,res,next));
router.get('/:slug',  cache('10m'), (req,res,next) => c().getBySlug(req,res,next));
router.put('/:slug',  authenticate, authorize(ROLES.ADMIN,ROLES.SUPER_ADMIN), (req,res,next) => c().update(req,res,next));
router.delete('/:slug',authenticate, authorize(ROLES.ADMIN,ROLES.SUPER_ADMIN), (req,res,next) => c().remove(req,res,next));
module.exports = router;
