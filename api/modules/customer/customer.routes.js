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
  app.patch(
    `${version}${resource}`,
    verifyToken,
    customerMiddleware.validateUpdateCustomerParams,
    customerController.updateCustomerProfile,
  );
  app.patch(
    `${version}${resource}/password`,
    verifyToken,
    customerMiddleware.validateUpdateCustomerPasswordParams,
    customerController.updateCustomerPassword,
  );
  app.post(
    `${version}${resource}/reset-password`,
    customerMiddleware.validateResetPasswordParams,
    customerController.sendResetPasswordEmail,
  );
  app.patch(
    `${version}${resource}/update-password/:id`,
    customerMiddleware.validateUpdatePasswordParams,
    customerController.resetCustomerPassword,
  );
}