
const glob = require('globby');
const path = require('path');
const _ = require('lodash');

const routeNames = glob.sync(__dirname + '/**/*.js');
const filteredRoutes = _.filter(routeNames, r => !r.includes('index'));

const routes = {};
_.forEach(filteredRoutes, (filteredRoute) => {
  filteredRoute = path.resolve(filteredRoute);
  const routeName = filteredRoute.split(path.sep).slice(-1)[0].split('.')[0];
  routes[routeName] = require(filteredRoute);
});

module.exports = routes;

