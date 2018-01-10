
const _ = require('lodash');
const { onlineUsers } = require('./io/connection');

exports.override = function(app) {
  app.get('/api/v1/rooms/:roomName/onlineusers', function(req, res) {
    const { roomName } = req.params;
    app.io.in(roomName).clients((err, clients) => {
      if (err) throw err;
      const usersInRoom = Object.values(onlineUsers).filter((item) => {
        return clients.includes(item.socketId);
      });
      const sortedUsers = _.sortBy(usersInRoom, [obj => obj.username]);
      res.json(sortedUsers);
    });
  });
};
