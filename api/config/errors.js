const glob = require('glob');
const _ = require('lodash');
const fs = require('fs');
const winston = require('./winston');

winston.info('Loading error messages');
const routePath = 'modules/**/*.errors.json';
const errorObject = {
  '0001': {
    msg: 'Record doesn\'t exist.',
  },
  '0002': {
    msg: 'Something went wrong.',
  },
};

glob.sync(routePath).forEach((file) => {
  _.extend(errorObject, JSON.parse(fs.readFileSync(file, 'utf-8')));
  winston.info(`'${file}' +  is loaded`);
});

module.exports = errorObject;
