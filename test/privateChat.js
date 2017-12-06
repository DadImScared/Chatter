
process.env.NODE_ENV = 'test';
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');

const { Conversation, Message } = require('../models');
const { createUsers, cleanUpData, } = require('./utility');
const { makeToken } = require('../token');
const app = require('../app');

chai.use(chaiHttp);

describe('private chat route', function() {
  let users;
  beforeEach(async function() {
    await cleanUpData();
    users = await createUsers();
    const convo1 = await new Conversation({ participants: [users[0], users[1]] }).save();
    const convo2 = await new Conversation({ participants: [users[0], users[2]] }).save();
    await new Message({ conversation: convo1._id, senderUsername: users[0].username, sender: users[0], message: "hello" }).save();
    await new Message({ conversation: convo1._id, senderUsername: users[0].username, sender: users[0], message: "hello again" }).save();
    await new Message({ conversation: convo1._id, senderUsername: users[0].username, sender: users[0], message: "hello again" }).save();
    await new Message({ conversation: convo2._id, senderUsername: users[0].username, sender: users[0], message: "hello" }).save();
  });

  describe('GET /conversations ', function() {
    it('should return a conversation list with message history', function(done) {
      const token = makeToken({ id: users[0].id });
      chai.request(app)
        .get('/api/v1/conversations')
        .set('Authorization', `JWT ${token}`).set('Content-Type', 'application/json')
        .end(function(err, res) {
          if (err) done(err);
          console.log(res.body);
          done();
        })
    });
  });
});
