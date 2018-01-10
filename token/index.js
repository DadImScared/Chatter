
require('dotenv').load({ path: '../.env' });
const jwt = require('jsonwebtoken');


const makeToken = (payload, expires='10h', options) => {
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: expires, ...options });
};

module.exports = {
  makeToken
};
