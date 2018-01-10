
process.env.NODE_ENV = 'test';
const chai = require('chai');
const should = chai.should();
const { User, Room } = require('../models');
const chaiHttp = require('chai-http');
const { makeToken } = require('../token');
// const app = require('../app');
const { socketClient } = require('./utility');

chai.use(chaiHttp);

describe('Rooms', () => {
  let server;
  let user1;
  let user2;
  let user3;
  const users = [
    { username: "tom", password: "password" },
    { username: "mary", password: "password" },
    { username: "pete", password: "password" },
  ];


  beforeEach(async function() {
    server = require('../bin/www');
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
  });
});
