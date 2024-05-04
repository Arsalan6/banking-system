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
  // Todo: remove this!
  app.get(
    `${version}${resource}`,
    verifyToken,
    customerController.getAllCustomers,
  );
  // app.patch(
  //   `${version}${resource}/:id`,
  //   todoMiddleware.validateUpdateTodoParams,
  //   errorMiddleware,
  //   todoController.updateTodoById,
  // );
  // app.post(
  //   `${version}${resource}/:id/sub-task`,
  //   todoMiddleware.validateCreateSubTaskParams,
  //   errorMiddleware,
  //   todoController.createSubTask
  // );
  // app.patch(
  //   `${version}${resource}/:todoId/sub-task/:id`,
  //   todoMiddleware.validateUpdateSubTaskParams,
  //   todoMiddleware.validateUpdateTodoParams,
  //   errorMiddleware,
  //   todoController.updateSubTaskById,
  // );
}