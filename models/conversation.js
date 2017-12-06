
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Conversation = new Schema({
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

Conversation.statics.findOrCreate = async function(participants) {
  const conversationObj = new this();
  try {
    const conversation = await this.findOne({ participants: { $all: participants } });
    if (conversation) {
      return conversation;
    } else {
      conversationObj.participants = participants;
      return await conversationObj.save();
    }
  } catch (e) {
    throw e;
  }
};

module.exports = mongoose.model('Conversation', Conversation);
