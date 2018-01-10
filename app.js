
const express = require('express');
const config = require('config');
require('dotenv').config();

const app = express();

require('./initializers')(app, config);

module.exports = app;
