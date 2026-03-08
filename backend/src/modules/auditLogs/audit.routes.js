'use strict';
const express = require('express');
const router = express.Router();
let _c; const c = () => { if (!_c) _c = require('./audit.controller'); return _c; };

// authenticate + authorize(ADMIN) applied in routes.js
router.get('/',              (req,res,next) => c().getLogs(req,res,next));
router.get('/user/:userId',  (req,res,next) => c().getByUser(req,res,next));
router.get('/:id',           (req,res,next) => c().getById(req,res,next));
module.exports = router;
