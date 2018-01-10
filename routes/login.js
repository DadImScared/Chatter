
require('dotenv').load({ path: '../.env' });
const jwt = require('jsonwebtoken');
const passport = require('passport');
const express = require('express');
const router = express.Router();

router.post('/', passport.authenticate('local'), (req, res) => {
  const token = jwt.sign({ id: req.user.id }, process.env.SECRET_KEY, { expiresIn: '10h' });
  res.json({ token });
});

module.exports = {
  route: router,
  path: '/login'
};
