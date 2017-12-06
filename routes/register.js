
require('dotenv').load({path: '../.env'});
const { check, validationResult } = require('express-validator/check');
const { matchedData } = require('express-validator/filter');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const { User } = require('../models');


router.post('/', [
  check('username').trim()
    .custom(async value => {
      try {
        const user = await User.findOne({"username": value});
        if (user) {
          throw new Error('Username taken');
        }
        return value;
      } catch(e) {
        throw new Error(e);
      }
    }),
  check('password', 'passwords must be at least 5 chars long')
    .isLength({min: 5}),
  check('confirmPass', 'passwords must match')
    .custom((value, { req }) => value === req.body.password)
], function(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.mapped() });
  }
  const { username, password } = matchedData(req);
  User.register(new User({ username }), password, function(err, user) {
    if (err) {
      return next(err);
    }
    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '10h' });
    res.status(201).json({ token });
  })
});


module.exports = router;
