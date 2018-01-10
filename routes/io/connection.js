
const _ = require('lodash');

const onlineUsers = {};

exports.override = function(app) {
  const { io, models: { Conversation, Message, User, RoomMessage, Room } } = app;
  io.on('connection', (socket) => {
    socket.currentRoom = '';
    onlineUsers[socket.user.id] = {
      socketId: socket.id,
      username: socket.user.username,
      _id: socket.user.id
    };

    socket.on('joinRoom', (room) => {
      socket.join(room);
      io.to(room).emit('userJoinedRoom', socket.user);
    });

    socket.on('leaveRoom', (room) => {
      socket.leave(room, err => {
        if (err) console.log(err);
        socket.broadcast.to(room).emit('userLeftRoom', socket.user)
      });
    });

    socket.on('newRoom', data => {
      socket.broadcast.emit('newRoom', data);
    });

    socket.on('privateMessage', async (data) => {
      try {
        const user = await User.findOne({ _id: data.userId });
        const participants = [user, socket.user];
        const conversation = await Conversation.findOrCreate(participants);
        const message = await new Message({ conversation: conversation._id, senderUsername: socket.user.username, sender: socket.user, message: data.message }).save();
        socket.broadcast.to(onlineUsers[data.userId].socketId).emit(
          'privateMessage', { message: data.message, sender: socket.user, createdAt: message.createdAt }
        );
      } catch (e) {
        console.log(e);
      }
    });

    socket.on('roomMessage', async (data) => {
      try {
        const room = await Room.findOne({ name: data.room });
        const message = await new RoomMessage({ room, creator: socket.user, message: data.message}).save();
        socket.broadcast.to(data.room).emit('roomMessage', {
          room: data.room, message: message.message, sender: message.creator, createdAt: message.createdAt
        })
      } catch (e) {
        // do something with error
        console.log(e);
      }
    });

    socket.on('disconnecting', () => {
      _.forEach(Object.values(socket.rooms), function(value) {
        socket.broadcast.to(value).emit('userLeftRoom', socket.user);
      });
    });

    socket.on('disconnect', () => {
      delete onlineUsers[socket.user._id]
    });
  });
};

module.exports.onlineUsers = onlineUsers;
