var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const socket_io = require('socket.io');
const config = require('config');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const _ = require('lodash');
require('dotenv').config();

const transporter = require('./mail/index');
// const User = require('./models/user');
// const Room = require('./models/room');

const { User, Room, RoomMessage, Message, Conversation } = require('./models');

const mongoose = require('mongoose');
mongoose.connect(config.DBHost, {useMongoClient: true});

const io = socket_io();


var index = require('./routes/index');
var users = require('./routes/users');
const register = require('./routes/register');
const login = require('./routes/login');
const rooms = require('./routes/rooms')(io);
const privateChat = require('./routes/privateChat');

var app = express();
app.io = io;

app.use(passport.initialize());
require('./passportConfig')(passport, process.env.SECRET_KEY, User);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/build')));

// app.use('/', index);
app.use('/api/v1', users);
app.use('/api/v1/register', register);
app.use('/api/v1/login', login);
app.use('/api/v1', rooms);
app.use('/api/v1', privateChat);

const onlineUsers = {};
// const userList = require('./routes/connectedusers')(onlineUsers);
// app.use('/api/v1/', userList);

io.use((socket, next) => {
    const token = socket.handshake.query.token;
    jwt.verify(token, process.env.SECRET_KEY, async function(err, { id }) {
      if (err) {
        const authError = new Error();
        authError.data = { type: 'authenticationError' };
        return next(authError);
      }
      try {
        const user = await User.findOne({ _id: id });
        if (user) {
          socket.user = user;
          next();
        } else {
          const authError = new Error();
          authError.data = { type: 'authenticationError' };
          return next(authError);
        }
      } catch (e) {
        console.log(e);
      }
    });
});

io.on('connection', (socket) => {
  socket.currentRoom = '';
  onlineUsers[socket.user.id] = {
    socketId: socket.id,
    username: socket.user.username,
    _id: socket.user.id
  };
  socket.on('message', (data) => {
    // console.log(data);
  });

  socket.on('joinRoom', (room) => {
    socket.join(room);
    io.to(room).emit('userJoinedRoom', socket.user);
    // socket.broadcast.to(socket.currentRoom).emit('userJoinedRoom', socket.user);
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
    // emit disconnect event to client
    // delete key of socket.user._id in onlineUsers
    delete onlineUsers[socket.user._id]
  });
});

app.get('/api/connectedusers', function(req, res) {
  res.json({ users: Object.values(onlineUsers) });
});
app.get('/api/v1/rooms/:roomName/onlineusers', function(req, res) {
  io.in(req.params.roomName).clients((err, clients) => {
    if (err) throw err;
    const usersInRoom = Object.values(onlineUsers).filter((item) => {
      return clients.includes(item.socketId);
    });
    const sortedUsers = _.sortBy(usersInRoom, [function(obj) {return obj.username}]);
    res.json(sortedUsers);
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {

  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  // res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

module.exports = app;
