
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Message = new Schema({
  conversation: { type: Schema.Types.ObjectId, ref: 'Conversation' },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  senderUsername: String,
  createdAt: { type: Date, default: Date.now, required: true },
  message: { type: String, required: true },
});

module.exports = mongoose.model('Message', Message);
