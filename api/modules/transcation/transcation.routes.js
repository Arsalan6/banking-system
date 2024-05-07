// Importing app dependencies
const transcationController = require('./transcation.controller');
const transcationMiddleware = require('./transcation.middleware');
const errorMiddleware = require('../../config/error-middleware');
const verifyToken = require('../../config/auth-middleware');

const resource = '/transcation';

module.exports = function (app, version) {
  app.post(
    `${version}${resource}`,
    verifyToken,
    transcationMiddleware.validateCreateTranscationParams,
    errorMiddleware,
    transcationController.createTransaction,
  );
  app.get(
    `${version}${resource}`,
    verifyToken,
    errorMiddleware,
    transcationController.getAllTransactions,
  );
  app.post(
    `${version}${resource}/transfer`,
    verifyToken,
    transcationMiddleware.validateTransferFundsParams,
    errorMiddleware,
    transcationController.transferFunds,
  );
}
