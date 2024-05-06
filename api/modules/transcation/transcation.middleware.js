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
};
