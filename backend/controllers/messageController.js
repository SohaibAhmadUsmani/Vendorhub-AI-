const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

/**
 * @desc    Test Messaging Route
 * @route   GET /api/messages/test
 * @access  Public
 */
const getMessageTest = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Messaging API endpoint is active (Module 11)',
    timestamp: new Date().toISOString(),
  });
};

/**
 * @desc    List all conversations for the logged-in user (buyer side)
 * @route   GET /api/messages/conversations
 * @access  Private
 */
const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ buyer: req.user.id })
      .populate('vendor', 'name logo location verificationStatus')
      .sort({ lastMessageAt: -1 });
    res.status(200).json({ success: true, conversations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Get or create a conversation between the logged-in buyer and a vendor
 * @route   POST /api/messages/conversations
 * @access  Private (buyer)
 * @body    { vendorId, rfqId? }
 */
const getOrCreateConversation = async (req, res) => {
  try {
    const { vendorId, rfqId } = req.body;
    let conversation = await Conversation.findOne({ buyer: req.user.id, vendor: vendorId });

    if (!conversation) {
      conversation = await Conversation.create({
        buyer: req.user.id,
        vendor: vendorId,
        rfq: rfqId || undefined,
      });
    }

    res.status(200).json({ success: true, conversation });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Get message history for a conversation
 * @route   GET /api/messages/conversations/:conversationId
 * @access  Private
 */
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ conversation: req.params.conversationId })
      .sort({ createdAt: 1 });
    res.status(200).json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Send a message (REST fallback — primary path is Socket.io, see index.js)
 * @route   POST /api/messages/conversations/:conversationId
 * @access  Private
 * @body    { text, attachmentUrl?, attachmentType? }
 */
const sendMessage = async (req, res) => {
  try {
    const { text, attachmentUrl, attachmentType } = req.body;

    const message = await Message.create({
      conversation: req.params.conversationId,
      sender: req.user.id,
      senderRole: req.user.role,
      text,
      attachmentUrl,
      attachmentType,
      readBy: [req.user.id],
    });

    await Conversation.findByIdAndUpdate(req.params.conversationId, {
      lastMessage: text || 'Sent an attachment',
      lastMessageAt: new Date(),
    });

    res.status(201).json({ success: true, message });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = { getMessageTest, getConversations, getOrCreateConversation, getMessages, sendMessage };
