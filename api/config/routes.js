// npm dependencies
const glob = require('glob');

// app dependencies
const winston = require('./winston');

module.exports = (app) => {
  winston.info('Loading routes');
  const routePath = 'modules/**/*.routes.js';
  const version = '/api/v1.0';
  glob.sync(routePath).forEach((file) => {
    require(`../${file}`)(app, version);
    winston.info(`'${file}' is loaded`);
  });
};