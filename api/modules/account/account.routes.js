// Importing app dependencies
const accountController = require('./account.controller');
const accountMiddleware = require('./account.middleware');
const errorMiddleware = require('../../config/error-middleware');
const verifyToken = require('../../config/auth-middleware');

const resource = '/account';

module.exports = function (app, version) {
  app.post(
    `${version}${resource}`,
    verifyToken,
    accountMiddleware.validateCreateAccountParams,
    errorMiddleware,
    accountController.createAccount,
  );
  app.get(
    `${version}${resource}`,
    verifyToken,
    errorMiddleware,
    accountController.getAllCustomerAccounts,
  );
  app.delete(
    `${version}${resource}/:id`,
    verifyToken,
    accountMiddleware.validateDeleteAccountParams,
    errorMiddleware,
    accountController.deleteAccountById,
  );
}