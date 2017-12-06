
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const RoomMessage = new Schema({
  room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
});

module.exports = mongoose.model('RoomMessage', RoomMessage);
