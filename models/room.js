
const mongoose = require('mongoose');
const { Schema } = mongoose;

const Room = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now, required: true }
});

module.exports = mongoose.model('Room', Room);
