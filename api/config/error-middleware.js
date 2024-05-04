const { validationResult } = require('express-validator');

const errorFormatter = ({
  location,
  msg,
  param,
  value,
  nestedErrors,
}) => msg;

module.exports = (req, res, next) => {
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    const err = errors.mapped();
    return next({
      name: 'ValidationError',
      errors: err,
      status: 400,
    });
  }
  return next();
};