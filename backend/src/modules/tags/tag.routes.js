'use strict';
const express = require('express');
const router = express.Router();
const { cache } = require('../../common/middleware/cache.middleware');
let _c; const c = () => { if (!_c) _c = require('./tag.controller'); return _c; };

router.get('/',        cache('10m'), (req,res,next) => c().getAll(req,res,next));
router.get('/popular', cache('5m'),  (req,res,next) => c().getPopular(req,res,next));
router.get('/:slug',   cache('5m'),  (req,res,next) => c().getBySlug(req,res,next));
module.exports = router;
