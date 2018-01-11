
const express = require('express');
const router = express.Router();


module.exports = function(userList) {
  router.get('/connectedusers', function(req, res) {
    res.json({ users: Object.values(userList) });
  });
  return router
};
