
const _ = require('lodash');
const routes = require('../routes');

module.exports = function(app) {
  _.forEach(_.toPairs(routes), ([routeName, { override, route, path = '' }]) => {
    if(override)
      override(app);
    else
      app.use(`/api/v1${path}`, route);
  });
};
