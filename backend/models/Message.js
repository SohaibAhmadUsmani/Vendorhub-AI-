const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderRole: { type: String, enum: ['buyer', 'vendor'], required: true },

  text: { type: String },
  attachmentUrl: { type: String }, // Cloudinary URL — file/image
  attachmentType: { type: String, enum: ['image', 'file', 'voice', null], default: null },

  translatedText: { type: String }, // optional AI-translated version
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
