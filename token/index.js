
require('dotenv').load({path: '../.env'});
const jwt = require('jsonwebtoken');


const makeToken = (payload, expires='10h', options) => {
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: expires, ...options});
};

const checkToken = (token) => {
  try {
    return jwt.verify(token, process.env.SECRET_KEY);
  } catch (e) {
    throw e;
  }
};

module.exports = {
  checkToken,
  makeToken
};
