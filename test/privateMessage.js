
process.env.NODE_ENV = 'test';
const chai = require('chai');
const should = chai.should();

const { Friends, Message } = require('../models');

const { createUsers, cleanUpData, makeClients, cleanUpClients } = require('./utility');


describe('Private Messages', function() {
  let server;
  let users;
  beforeEach( async function() {
    server = require('../bin/www');
    await cleanUpData();
    users = await createUsers();
    await new Friends({ user1: users[0], user2: users[1], status: 'accepted' }).save()
  });

  describe('Sent messages', function() {
    it('should go through if users are friends', function(done) {
      const clients = makeClients(users);
      clients[0].emit('privateMessage', {
        userId: users[1].id,
        message: 'hello friend',
      });
      clients[1].on('privateMessage', (data) => {
        data.should.be.a('object');
        data['message'].should.equal('hello friend');
        data['sender']['username'].should.equal('tom');
      });
      setTimeout(() => {cleanUpClients(clients); done()}, 500);
    });
    it("should not sent messages if users aren't friends", async function() {
      await cleanUpData();
      const clients = makeClients(users);
      clients[0].emit('privateMessage', {
        userId: users[1].id,
        message: 'hello friend',
      });
      const messages = await Message.find({});
      messages.should.have.lengthOf(0);
      setTimeout(() => {cleanUpClients(clients);}, 500);
    });
  })
});
