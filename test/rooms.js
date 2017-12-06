
process.env.NODE_ENV = 'test';
const chai = require('chai');
const should = chai.should();
const { User, Room } = require('../models');
const io = require('socket.io-client');
const chaiHttp = require('chai-http');
const { makeToken } = require('../token');
// const app = require('../app');
const { socketClient } = require('./utility');

chai.use(chaiHttp);


// const socketClient = (id, userOptions, host="http://localhost:4000", withAuth=true) => {
//   const options ={
//     // transports: ['websocket'],
//     'forceNew': true,
//     query: withAuth ? { token: makeToken({ id }) } : {},
//     ...userOptions
//   };
//   return io.connect(host, { ...options })
// };

const makeClients = (userList) => {
  const clients = [];
  for (let user of userList ) {
    clients.push(socketClient(user.id))
  }
  return clients;
};

const attachEvent = (client, eventName, cb) => {
  client.on(eventName, data => {
    cb(data);
  });
};

describe('Rooms', () => {
  let server;
  let user1;
  let user2;
  let user3;
  let client1;
  let client2;
  let client3;
  const users = [
    { username: "tom", password: "password" },
    { username: "mary", password: "password" },
    { username: "pete", password: "password" },
  ];


  beforeEach(async function() {
    server = require('../bin/www');
    // User.deleteMany({}, async () => {
    //   user1 = await new User({ username: "tom", password: "password" }).save();
    //   done();
    // });
    await User.deleteMany({});
    await Room.deleteMany({});
    user1 = await new User({ username: "tom", password: "password" }).save();
    user2 = await new User(users[1]).save();
    user3 = await new User(users[2]).save();
  });

  afterEach(async function() {
    await User.deleteMany({});
  });

  describe('/api/v1/rooms post request', () => {
    it('should emit newRoom event to all sockets on new room', (done) => {
      const clients = [socketClient(user1.id), socketClient(user2.id), socketClient(user3.id)];
      const token = makeToken({ id: user1.id });
      chai.request(server)
        .post('/api/v1/rooms')
        .set('Authorization', `JWT ${token}`).set('Content-Type', 'application/json')
        .send({ room: "firstroom" })
        .end(function(err, res) {
          if (err) {
            done(err);
          }
          for (let client of clients ){
            client.on('newRoom', data => {data.should.be.an('object'); data['name'].should.equal('firstroom')});
          }
          res.should.have.status(201);
          setTimeout(() => {
            for ( let client of clients ) {
              client.disconnect();
            }
            done();}, 500);
        });
    });
    it('should x', done => {
      chai.request(server)
        .get('/api/v1/connectedusers')
        .end(function( err, res ) {
          if (err) {
            done(err);
          }
          console.log('before');
          console.log(res.body)
        });
      const clients = [socketClient(user1.id), socketClient(user2.id), socketClient(user3.id)];
      chai.request(server)
        .get('/api/v1/connectedusers')
        .end(function( err, res ) {
          if (err) {
            done(err);
          }
          console.log('after');
          console.log(res.body);
        })
    });
  });
});
