
process.env.NODE_ENV = 'test';
const chai = require('chai');
const should = chai.should();
const { User } = require('../models');
const io = require('socket.io-client');


describe("echo", () => {
  let server;
  const options ={
    transports: ['websocket'],
    'forceNew': true
  };

  beforeEach(done => {
    server = require('../bin/www');
    done();
  });

  it('echos messages', done => {
    const client = io.connect("http://localhost:4000", options);
    const client2 = io.connect("http://localhost:4000", options);

    client.emit('newRoom', 'hello from client');

    client2.on('newRoom', data => {
      data.should.equal('hello from client');
      client.disconnect();
      client2.disconnect();
      done();
    });

  });

});
