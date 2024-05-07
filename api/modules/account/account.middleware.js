// Importing npm dependencies
const { check, param } = require('express-validator');

// Importing app dependencies
const constants = require('../../config/constants');

module.exports = {
  validateCreateAccountParams: [
    check('accountName', '2001').exists().isString(),
    check('accountType', '2002').exists().isString(),
    check('accountType', '2003').isIn(Object.values(constants.accountType)),
  ],
  validateDeleteAccountParams: [
    param('accountNumber', '2004').isLength({ min: 8, max:8 }).exists().isInt(),
  ],
};