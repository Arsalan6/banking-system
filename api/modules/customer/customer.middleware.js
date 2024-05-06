// Importing npm dependencies
const { check, param } = require('express-validator');

// Importing app dependencies
const constants = require('../../config/constants');

module.exports = {
  validateCreateCustomerParams: [
    check('firstName', '1003').exists().isString(),
    check('lastName', '1003').exists().isString(),
    check('email', '1005').exists().isString(),
    check('email', '1006').isEmail(),
    check('password', '1008').exists().isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      returnScore: false,
      pointsPerUnique: 1,
      pointsPerRepeat: 0.5,
      pointsForContainingLower: 10,
      pointsForContainingUpper: 10,
      pointsForContainingNumber: 10,
      pointsForContainingSymbol: 10,
    }),
    check('phoneNumber', '1009').isMobilePhone("en-GB"),
  ],
  validateLoginParams: [
    check('email', '1005').exists().isString(),
    check('email', '1006').isEmail(),
    check('password', '1007').exists().isString(),
  ],
  validateUpdateCustomerParams: [
    check('firstName', '1003').exists().isString(),
    check('lastName', '1003').exists().isString(),
    check('phoneNumber', '1009').isMobilePhone("en-GB"),
  ],
  validateUpdateCustomerPasswordParams: [
    check('currentPassword', '1012').exists().isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      returnScore: false,
      pointsPerUnique: 1,
      pointsPerRepeat: 0.5,
      pointsForContainingLower: 10,
      pointsForContainingUpper: 10,
      pointsForContainingNumber: 10,
      pointsForContainingSymbol: 10,
    }),
    check('updatedPassword', '1013').exists().isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      returnScore: false,
      pointsPerUnique: 1,
      pointsPerRepeat: 0.5,
      pointsForContainingLower: 10,
      pointsForContainingUpper: 10,
      pointsForContainingNumber: 10,
      pointsForContainingSymbol: 10,
    }),
  ],
  validateResetPasswordParams: [
    check('email', '1005').exists().isString(),
    check('email', '1006').isEmail(),
  ],
  validateUpdatePasswordParams: [
    param('id', '2004').exists().isUUID(4),
    check('newPassword', '1008').exists().isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      returnScore: false,
      pointsPerUnique: 1,
      pointsPerRepeat: 0.5,
      pointsForContainingLower: 10,
      pointsForContainingUpper: 10,
      pointsForContainingNumber: 10,
      pointsForContainingSymbol: 10,
    }),
  ],
};