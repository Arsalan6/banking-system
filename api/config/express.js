
// Importing npm dependencies
const { map } = require('lodash');
const winston = require('./winston');

// Importing app dependencies
const errorCodes = require('./errors');


module.exports = (app) => {
  require('./routes')(app);
  // error handling
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    // express validator validation error.
    if (err.name === 'ValidationError') {
      winston.error(`[${req.method}][${req.originalUrl}] Validation failed: ${JSON.stringify(req.body)}`);
      const errors = map(err.errors, code => ({
        message: errorCodes[code].msg,
        code,
      }));
      res.json({
        success: 0,
        message: 'Errors encountered while validating request parameters.',
        response: err.status,
        data: {},
        errors,
      });
      // 404, 400 error handler
    } else if ((err.status === 404 || err.status === 400) && err.msgCode) {
      winston.error(`[${req.method}][${req.originalUrl}] Record doesn't exist.`);
      res.json({
        success: 0,
        message: errorCodes[err.msgCode].msg,
        response: 404,
        data: {},
      });
      // 500 error handler
    } else if (err.status === 500 && err.msgCode) {
      winston.error(`[${req.method}][${req.originalUrl}] ${JSON.stringify(err.data)}`);
      const data = err.data || {};
      res.status(err.status).json({
        success: 0,
        message: errorCodes[err.msgCode].msg,
        response: err.status,
        data,
      });
    } else {
      winston.error(`[${req.method}][${req.originalUrl}] Something went wrong: ${JSON.stringify(err)}`);
      res.json({
        success: 0,
        message: 'Something went wrong. Please try again.',
        response: 304,
        data: {},
      });
    }
  });
};