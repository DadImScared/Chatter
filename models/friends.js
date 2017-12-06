
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Friends = new Schema({
  user1: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  user2: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    default: 'sent'
  }
});


module.exports = mongoose.model('Friends', Friends);
