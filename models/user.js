
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const Friends = require('./friends');


const User = new Schema({
    username: {type: String, unique: true},
});

User.methods.friendsWith = async function(friend){
  try {
    return await Friends.findOne({
      $or: [{ user1: this, user2: friend }, { user1: friend, user2: this }]
    });
  } catch (e) {
    throw e;
  }
};

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
