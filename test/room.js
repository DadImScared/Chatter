
process.env.NODE_ENV = 'test';
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');

const { Room } = require('../models');
const { createUsers, cleanUpData, makeClients, cleanUpClients } = require('./utility');

chai.use(chaiHttp);

describe('Room', function() {
  let server;
  let users;

  beforeEach(async function() {
    server = require('../bin/www');
    await cleanUpData();
    users = await createUsers();
    await new Room({ creator: users[0], name: "firstroom" }).save();
    await new Room({ creator: users[0], name: "secondroom" }).save();
  });


  describe('Room message', function() {
    it('should emit message to all other sockets besides sent one that are in the room', function(done) {
      const clients = makeClients(users);
      for (let client of clients) {
        client.emit('joinRoom', 'firstroom');
      }
      clients[0].emit('roomMessage', { room: 'firstroom', message: "taco" });
      for ( let client of clients.slice(1) ) {
        client.on('roomMessage', data => {
          data.should.be.an('object');
          data['room'].should.equal('firstroom');
          data['message'].should.equal('taco');
          data['sender']['username'].should.equal('tom');
        });
      }
      setTimeout(() => {cleanUpClients(clients); done()}, 500);
    });
  });

  describe('Online users in room', function() {
    it('should return a list of all users in the room', function(done) {
      const clients = makeClients(users);
      for (let client of clients.slice(1)) {
        client.emit('joinRoom', 'firstroom');
      }
      setTimeout(() => {
        chai.request(server)
          .get('/api/v1/rooms/firstroom/onlineusers')
          .end(function(err, res) {
            if (err) done(err);
            console.log(res.body);
            setTimeout(() => {cleanUpClients(clients); done()}, 500);
          })
      }, 500)
    });
  });
});
