// Importing app dependencies
const customerController = require('./customer.controller');
const customerMiddleware = require('./customer.middleware');
const errorMiddleware = require('../../config/error-middleware');
const verifyToken = require('../../config/auth-middleware');

const resource = '/customer';

module.exports = function (app, version) {
  app.post(
    `${version}${resource}`,
    customerMiddleware.validateCreateCustomerParams,
    errorMiddleware,
    customerController.createCustomer,
  );
  app.post(
    `${version}${resource}/login`,
    customerMiddleware.validateLoginParams,
    errorMiddleware,
    customerController.loginCustomer,
  );
  app.get(
    `${version}${resource}`,
    verifyToken,
    customerController.getCustomerDetails,
  );
}