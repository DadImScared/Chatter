
module.exports = function(app, config) {
  require('./express')(app);
  require('./models')(app, config);
  require('./passport')(app);
  require('./io')(app);
  require('./routes')(app);
  require('./errorHandling')(app);
};
