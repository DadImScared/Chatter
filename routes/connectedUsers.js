
const { onlineUsers } = require('./io/connection');

exports.override = function(app) {
  app.get('/api/connectedusers', function(req, res) {
    res.json({ users: Object.values(onlineUsers) });
  });
};
