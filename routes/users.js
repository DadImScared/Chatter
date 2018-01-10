
const express = require('express');
const router = express.Router();

const { User } = require('../models');

/* GET users listing. */
router.get('/', function(req, res) {
  res.json({ message: 'taco' });
});

router.post('/userexists', async function(req, res) {
  const { username } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      res.json({ message: true });
    }
    else {
      res.json({ message: false });
    }
  }
  catch (e) {
    res.json({ message: false });
  }
});

module.exports = {
  route: router
};
