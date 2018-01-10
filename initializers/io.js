
const io = require('socket.io');

module.exports = function(app) {
  app.io = io();
};
