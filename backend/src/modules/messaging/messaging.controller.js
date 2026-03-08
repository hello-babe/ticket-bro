'use strict';
const asyncHandler = require('../../common/utils/asyncHandler');
const { sendSuccess, sendCreated } = require('../../common/utils/apiResponse');

class MessagingController {
  startConversation  = asyncHandler(async (req, res) => { sendCreated(res, 'Conversation started.', { id: `conv_${Date.now()}`, participants: [req.body.userId] }); });
  getConversations   = asyncHandler(async (req, res) => { sendSuccess(res, 'Conversations fetched.', { conversations: [] }); });
  getConversation    = asyncHandler(async (req, res) => { sendSuccess(res, 'Conversation fetched.', { id: req.params.id }); });
  deleteConversation = asyncHandler(async (req, res) => { sendSuccess(res, 'Conversation deleted.'); });
  getMessages        = asyncHandler(async (req, res) => { sendSuccess(res, 'Messages fetched.', { messages: [] }); });
  sendMessage        = asyncHandler(async (req, res) => { sendCreated(res, 'Message sent.', { id: `msg_${Date.now()}`, content: req.body.content }); });
  markAsRead         = asyncHandler(async (req, res) => { sendSuccess(res, 'Marked as read.'); });
  getUnreadCount     = asyncHandler(async (req, res) => { sendSuccess(res, 'Unread count.', { count: 0 }); });
}
module.exports = new MessagingController();
