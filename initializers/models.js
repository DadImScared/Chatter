
const mongoose = require('mongoose');
const models = require('../models');

module.exports = function(app, { DBHost }) {
  mongoose.connect(DBHost, { useMongoClient: true });
  app.models = models;
  app.mongoose = mongoose;
};
