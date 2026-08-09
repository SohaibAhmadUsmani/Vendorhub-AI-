const express = require('express');
const router = express.Router();
const {
  getMessageTest,
  getConversations,
  getOrCreateConversation,
  getMessages,
  sendMessage,
} = require('../controllers/messageController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Module 11 — Messaging Routes
router.get('/test', getMessageTest);
router.get('/conversations', authMiddleware, getConversations);
router.post('/conversations', authMiddleware, getOrCreateConversation);
router.get('/conversations/:conversationId', authMiddleware, getMessages);
router.post('/conversations/:conversationId', authMiddleware, sendMessage);

module.exports = router;
