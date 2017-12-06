
const { check, validationResult } = require('express-validator/check');
const { matchedData } = require('express-validator/filter');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const { Room } = require('../models');


module.exports = function(io) {
  router.post('/rooms', [
    passport.authenticate('jwt', { session: false }),
    check('room', 'room must be 3-50 characters and only consist of letters')
      .exists()
      .matches(/^[a-zA-Z]{3,50}$/)
      .custom(async value => {
        try {
          const room = await Room.findOne({ name: value });
          if (room) {
            throw new Error('Room exists');
          } else {
            return value;
          }
        } catch (e) {
          throw new Error(e);
        }
      })
  ], async function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.mapped() });
    }
    const { room } = matchedData(req);
    const newRoom = new Room({ name: room, creator: req.user });
    await newRoom.save();
    io.sockets.emit('newRoom', newRoom);
    res.status(201).json({ "message": "success", "room": newRoom });
  });
  router.get('/rooms', async function(req, res) {
    try {
      const rooms = await Room.find({}).sort('name');
      res.json(rooms);
    } catch (e) {
      console.log(e);
    }
  });
  // router.get('/rooms/:roomName/onlineusers', function(req, res) {
  //   console.log(req.params.roomName);
  //   io.in(req.params.roomName).clients((err, clients) => {
  //     if (err) throw err;
  //     const currentUsers = Object.values(onlineUsers).filter((item) => {
  //       return clients.includes(item.socketId);
  //     });
  //     console.log(io.sockets);
  //     console.log(currentUsers);
  //     res.json(clients);
  //   });
  // });
  return router;
};
