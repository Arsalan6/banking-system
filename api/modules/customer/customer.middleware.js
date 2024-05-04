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
  // validateUpdateTodoParams: [
  //   param('id', '1005').exists().isUUID(4),
  //   check('status', '1006').exists(),
  //   check('status', '1007').isIn(Object.values(constants.taskStatus)),
  // ],
  // validateCreateSubTaskParams: [
  //   param('id', '1005').exists().isUUID(4),
  //   check('title', '1003').exists(),
  //   check('title', '1004').isString(),
  // ],
  // validateUpdateSubTaskParams: [
  //   param('todoId', '1008').exists().isUUID(4),
  // ]
};