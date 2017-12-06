
const io = require('socket.io-client');
const { makeToken } = require('../token');
const { User, Room, RoomMessage, Friends, Message, Conversation } = require('../models');

const socketClient = (id, userOptions={}, withAuth=true) => {
  const options ={
    // transports: ['websocket'],
    'forceNew': true,
    query: withAuth ? { token: makeToken({ id }) } : {},
    ...userOptions
  };
  return io.connect("http://localhost:4000", { ...options })
};

const makeClients = (userList) => {
  const clients = [];
  for (let user of userList ) {
    clients.push(socketClient(user.id))
  }
  return clients;
};

const cleanUpClients = (clientList) => {
  for ( let client of clientList ) {
    client.disconnect();
  }
};

const createUsers = async () => {
  const users = [
    { username: "tom", password: "password" },
    { username: "mary", password: "password" },
    { username: "pete", password: "password" },
  ];
  const createdUsers = [];
  for ( let user of users ) {
    let newUser = await new User({ ...user }).save();
    createdUsers.push(newUser);
  }
  return createdUsers;
};

const cleanUpData = async () => {
  await User.deleteMany({});
  await Room.deleteMany({});
  await RoomMessage.deleteMany({});
  await Friends.deleteMany({});
  await Message.deleteMany({});
  await Conversation.deleteMany({});
};

module.exports = {
  socketClient,
  createUsers,
  cleanUpData,
  makeClients,
  cleanUpClients
};
