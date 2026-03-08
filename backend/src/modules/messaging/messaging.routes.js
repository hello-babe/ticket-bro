'use strict';
const express = require('express');
const router = express.Router();
let _c; const c = () => { if (!_c) _c = require('./messaging.controller'); return _c; };

// authenticate applied in routes.js
router.post('/conversations',                         (req,res,next) => c().startConversation(req,res,next));
router.get('/conversations',                          (req,res,next) => c().getConversations(req,res,next));
router.get('/conversations/:id',                      (req,res,next) => c().getConversation(req,res,next));
router.delete('/conversations/:id',                   (req,res,next) => c().deleteConversation(req,res,next));
router.get('/conversations/:id/messages',             (req,res,next) => c().getMessages(req,res,next));
router.post('/conversations/:id/messages',            (req,res,next) => c().sendMessage(req,res,next));
router.put('/conversations/:id/read',                 (req,res,next) => c().markAsRead(req,res,next));
router.get('/unread-count',                           (req,res,next) => c().getUnreadCount(req,res,next));
module.exports = router;
