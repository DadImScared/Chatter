var express = require('express');
var router = express.Router();

const { User } = require('../models');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({"message": "taco"});
});

router.post('/userexists', async function(req, res, next) {
  const { username } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      res.json({ "message": true })
    } else {
      res.json({ "message": false })
    }
  } catch (e) {
    res.json({ "message": false })
  }
});

module.exports = router;
