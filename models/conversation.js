
const mongoose = require('mongoose');
const { Schema } = mongoose;


const Conversation = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

Conversation.statics.findOrCreate = async function(participants) {
  const newConversation = new this();
  try {
    const conversation = await this.findOne({ participants: { $all: participants } });
    if (conversation) {
      return conversation;
    }
    else {
      newConversation.participants = participants;
      return await newConversation.save();
    }
  }
  catch (e) {
    throw e;
  }
};

module.exports = mongoose.model('Conversation', Conversation);
