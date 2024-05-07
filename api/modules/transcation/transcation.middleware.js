// Importing npm dependencies
const { check } = require('express-validator');

// Importing app dependencies
const constants = require('../../config/constants');

module.exports = {
  validateCreateTranscationParams: [
    check('accountId', '3001').exists().isInt(),
    check('transactionType', '3002').isIn(Object.values(constants.transactionType)),
    check('transactionAmount', '3003').exists().isInt(),
  ],
  validateTransferFundsParams: [
    check('recipientId', '3004').exists().isUUID(4),
    check('donorId', '3005').exists().isUUID(4),
    check('transactionAmount', '3003').exists().isInt(),
  ],
};
