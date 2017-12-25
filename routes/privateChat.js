
const express = require('express');
const router = express.Router();
const passport = require('passport');

const { Conversation, Message } = require('../models');

router.get('/conversations', passport.authenticate('jwt', { session: false }), async function(req, res) {
  const conversations = await Conversation.aggregate({ $addFields: {
    "otherUser": { $filter: {
      input: '$participants',
      as: "participant",
      cond: { $ne: ['$$participant', req.user._id] }
    } },
  }}).match({
    participants: { $in: [req.user._id] }
  }).lookup(
    {
      from: "users",
      localField: "otherUser",
      foreignField: "_id",
      as: "members"
    }
    ).unwind(
      'members'
  ).lookup({
    from: 'messages',
    localField: '_id',
    foreignField: "conversation",
    as: "messages"
  }).unwind(
    'messages', 'messages.sender', 'messages.senderUsername', 'messages.createdAt'
  ).sort(
    { "messages.createdAt": -1 }
  ).group(
    {
      _id: "$_id",
      participants: { $first: "$participants" },
      messages: {
        $addToSet: {
          _id: '$messages._id',
          sender: { username: "$messages.senderUsername"},
          message: "$messages.message",
          createdAt: '$messages.createdAt'
        }
      },
      lastMessage: { $first: "$messages"},
      members: { $addToSet: "$members" },
    }
  ).project(
    {
      messages: {$slice: ["$messages", -10]},
      lastMessage: "$lastMessage",
      otherUser: { $arrayElemAt: ["$members", 0] },
    }
  ).sort({ lastMessage: -1 });
  res.json(conversations);
});

module.exports = router;
