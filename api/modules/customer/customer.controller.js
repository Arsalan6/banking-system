// Importing npm dependencies
const { v4: uuidv4 } = require('uuid');
const { to } = require('await-to-js')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Importing app dependencies
const winston = require('../../config/winston');
const dbConfig = require('../../config/db-config');
const constants = require('../../config/constants');

module.exports = {
  /**
   * This method is used to create a new customer.
   * @param req
   * @param res
   * @param next
   */
  async createCustomer(req, res, next) {

    winston.info(`Creating new customer with email: ${JSON.stringify(req.body.email)}`);
    winston.info(`Checking if email: ${JSON.stringify(req.body.email)} is already registered`);

    const [errorCustomerexist, customerExist] = await to(dbConfig.getDbInstance().Customer.findOne({
      where: {
        email: req.body.email
      },
    }));
    if (errorCustomerexist) {
      winston.error(`Error occurred while creating user with email: ${req.body.email}, ${error}`);
      next(error);
    } else if (customerExist) {
      winston.error(`Customer with email ${req.body.email} is already registered.`);
      next({
        msgCode: '1010',
        status: 400,
      });
    } else {
      const userObj = {
        uuid: uuidv4(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
      };
  
      const hashedPassword = await bcrypt.hash(req.body.password, 15);
      const [errorCreatedUser, createdUser] = await to(dbConfig.getDbInstance().Customer.create({...userObj, password: hashedPassword}));
      if (errorCreatedUser) {
        winston.error(`Error occurred while registering new customer, ${errorCreatedUser}`);
        next(errorCreatedUser);
      } else {
        winston.info(`[${req.method}][${req.originalUrl}][${createdUser.id}] Customer created successfully`);
        res.status(200).send({
          success: 1,
          response: 200,
          message: 'Customer registered successfully.',
          data: { },
        });
      }
    }
  },
  /**
   * This method is responsible for loging a customer in.
   * @param req
   * @param res
   * @param next
   */
  async loginCustomer(req, res, next) {
    const { email, password } = req.body;
    winston.info(`Loging in customer with email: ${JSON.stringify(email)}`);
    const [errorCustomer, customer] = await to(dbConfig.getDbInstance().Customer.findOne({
      where: {
        email: email,
      }
    }));
    if (errorCustomer) {
      winston.error(`Error occurred while loging in customer with email: ${JSON.stringify(email)}, ${error}`);
      next(error);
    } else if (!customer) {
      winston.error(`Customer with email ${email} not found.`);
      next({
        msgCode: '1011',
        status: 400,
      });
    } else {
      winston.info(`Customer with email: ${JSON.stringify(email)} fetched successfully`);
      const passwordMatch = await bcrypt.compare(password, customer.password);

      if (!passwordMatch) {
        return res.status(402).send({
          success: 1,
          response: 200,
          message: 'Incorrect password or email',
          data: {},
        });
        }

      const token = jwt.sign({ customerId: customer.id }, process.env.SECRET_KEY, {
        expiresIn: '24h',
        });
      res.cookie('token', token, { httpOnly: true });
      res.status(200).send({
        success: 1,
        response: 200,
        message: 'Customer logged in successfully.',
        token: token,
      });
    }
  },


    /**
   * This method is responsible for loging a customer in.
   * @param req
   * @param res
   * @param next
   */
    async getAllCustomers(req, res, next) {
      winston.info('Fetching all todos from the database');
      const [error, todos] = await to(dbConfig.getDbInstance().Customer.findAll());
      if (error) {
        winston.error(`Error occurred while fetching all Todos form database, ${error}`);
        next(error);
      } else {
        winston.info(`[${req.method}][${req.originalUrl}] Todos fetched successfully, total count: ${todos.length}`);
        res.status(200).send({
          success: 1,
          response: 200,
          message: todos.length ? 'Todos fetched successfully.' : 'No Todos found.',
          data: todos.length ? todos : [],
        });
      }
    },
  // /**
  //  * This method is responsible for updating a todo.
  //  * @param req
  //  * @param res
  //  * @param next
  //  */
  // async updateTodoById(req, res, next) {
  //   winston.info(`Updating todo with uuid ${req.params.id}`);
  //   const [error, todo] = await to(dbConfig.getDbInstance().Todo.findOne({
  //     attributes: ['id', 'title', 'status', 'createdAt'],
  //     where: {
  //       uuid: req.params.id
  //     }
  //   }));
  //   if (error) {
  //     winston.error(`Error occurred while fetching todo with uuid: ${req.params.id}, ${error}`);
  //     next(error);
  //   } else if (todo) {
  //     winston.info(`Todo todo with uuid ${req.params.id} found successfully`);
  //     const [errorUpdatedTodo, updatedTodo] = await to(todo.update({
  //       status: req.body.status
  //     }));
  //     if (errorUpdatedTodo) {
  //       winston.error(`Error occurred while updating Todo with uuid: ${req.params.id}, ${errorUpdatedTodo}`);
  //       next(error);
  //     } else {
  //       winston.info(`Todo with uuid ${req.params.id} updated successfully`);
  //       // Todo: Use transaction for this, since one is not be complete without the other.
  //       winston.info(`Marking all subtasks to COMPLETE for todo with uuid ${req.params.id} `);
  //       const [errorSubTask] = await to(dbConfig.getDbInstance().SubTask.update(
  //         {
  //           status: req.body.status === constants.taskStatus.complete ? constants.taskStatus.complete : constants.taskStatus.pending
  //         }, {
  //         where: {
  //           todoId: todo.id
  //         }
  //       }
  //       ));
  //       if (errorSubTask) {
  //         winston.error(`Error occurred while updating subtasks for todo with uuid: ${req.params.id}, ${error}`);
  //       } else {
  //         winston.info(`Subtasks for todo with uuid ${req.params.id} updated successfully`);
  //         res.status(200).send({
  //           success: 1,
  //           response: 200,
  //           message: 'Todo updated successfully.',
  //           data: updatedTodo,
  //         });
  //       }
  //     }
  //   } else {
  //     winston.info(`No Todo found with uuid ${req.params.id}`);
  //     next({
  //       msgCode: '0001',
  //       status: 404,
  //     });
  //   }
  // },
  // /**
  //  * This method is used to create a new sub task for given todo.
  //  * @param req
  //  * @param res
  //  * @param next
  //  */
  // async createSubTask(req, res, next) {
  //   winston.info(`Creating new subtask for todo with uuid: ${req.params.id}`);
  //   winston.info(`Fetching todo with uuid: ${req.params.id}`);
  //   const [error, todo] = await to(dbConfig.getDbInstance().Todo.findOne({
  //     where: {
  //       uuid: req.params.id
  //     }
  //   }));
  //   if (error) {
  //     winston.error(`Error occurred while fetching todo with uuid: ${req.params.id}, ${error}`);
  //     next(error);
  //   } else if (todo) {
  //     winston.info(`Todo with uuid ${req.params.id} found successfully`);
  //     const subTaskObj = {
  //       uuid: uuidv4(),
  //       title: req.body.title,
  //       todoId: todo.id
  //     };
  //     const [errorSubTask, subTask] = await to(dbConfig.getDbInstance().SubTask.create(subTaskObj));
  //     if (errorSubTask) {
  //       winston.error(`Error occurred while creating a new subtask, ${errorSubTask}`);
  //       next(errorSubTask);
  //     } else {
  //       winston.info(`[${req.method}][${req.originalUrl}][${subTask.id}] Subtask created successfully`);
  //       // Todo: Use transaction for this as well, since one is not be complete without the other.
  //       winston.info(`Updating status for todo with uuid ${req.params.id}`);
  //       const [errorUpdatedTodo] = await to(todo.update({
  //         status: constants.taskStatus.pending
  //       }));
  //       if (errorUpdatedTodo) {
  //         winston.error(`Error occurred while updating Todo with uuid: ${req.params.id}, ${errorUpdatedTodo}`);
  //         next(error);
  //       } else {
  //         res.status(200).send({
  //           success: 1,
  //           response: 200,
  //           message: 'SubTask created successfully.',
  //           data: {
  //             id: subTask.id,
  //             uuid: subTask.uuid,
  //             title: subTask.title,
  //             status: subTask.status,
  //             createdAt: subTask.createdAt,
  //             todoId: subTask.todoId
  //           },
  //         });
  //       }
  //     }
  //   } else {
  //     winston.info(`No Todo found with uuid ${req.params.id}`);
  //     next({
  //       msgCode: '0001',
  //       status: 404,
  //     });
  //   }
  // },
  // /**
  //  * This method is responsible for updating a subtask by id.
  //  * @param req
  //  * @param res
  //  * @param next
  //  */
  // async updateSubTaskById(req, res, next) {
  //   winston.info(`Updating subtask with uuid ${req.params.id}`);
  //   // Todo: Create common method to fetch todo by uuid, since its used in multiple place.
  //   winston.info(`Fetching todo with uuid: ${req.params.todoId}`);
  //   const [error, todo] = await to(dbConfig.getDbInstance().Todo.findOne({
  //     include: [
  //       {
  //         model: dbConfig.getDbInstance().SubTask,
  //         attributes: ['id', 'uuid', 'title', 'status', 'createdAt'],
  //       },
  //     ],
  //     where: {
  //       uuid: req.params.todoId
  //     }
  //   }));
  //   if (error) {
  //     winston.error(`Error occurred while fetching todo with uuid: ${req.params.id}, ${error}`);
  //     next(error);
  //   } else if (todo) {
  //     winston.info(`Todo with uuid ${req.params.id} fetched successfully`);
  //     const [error, subTask] = await to(dbConfig.getDbInstance().SubTask.findOne({
  //       attributes: ['id', 'uuid', 'title', 'status', 'createdAt'],
  //       where: { uuid: req.params.id }
  //     }));
  //     if (error) {
  //       winston.error(`Error occurred while fetching subTask with uuid: ${req.params.id}, ${error}`);
  //       next(error);
  //     } else if (subTask) {
  //       winston.info(`SubTask with uuid ${req.params.id} found successfully`);
  //       const [errorUpdatedSubTask, updatedSubTask] = await to(subTask.update({
  //         status: req.body.status
  //       }));
  //       if (errorUpdatedSubTask) {
  //         winston.error(`Error occurred while updating subTask with uuid: ${req.params.id}, ${errorUpdatedSubTask}`);
  //         next(error);
  //       } else {
  //         winston.info(`SubTask with uuid ${req.params.id} updated successfully`);
  //         let todoStatus;
  //         // Checking if all other subtasks are completed and status of todo is pending then update the todo to complete.
  //         if (req.body.status === constants.taskStatus.complete &&
  //           todo.SubTasks.filter(subTask => subTask.id !== updatedSubTask.id).every(subtask => subtask.status === constants.taskStatus.complete) &&
  //           todo.status === constants.taskStatus.pending) {
  //           todoStatus = constants.taskStatus.complete;
  //         } else {
  //           todoStatus = constants.taskStatus.pending;
  //         }

  //         // Todo: Use transaction for this as well, since one is not be complete without the other.
  //         winston.info(`Updating status for todo with uuid ${req.params.id}`);
  //         const [errorUpdatedTodo, updatedTodo] = await to(todo.update({
  //           status: todoStatus
  //         }));
  //         if (errorUpdatedTodo) {
  //           winston.error(`Error occurred while updating Todo with uuid: ${req.params.id}, ${errorUpdatedTodo}`);
  //           next(error);
  //         } else {
  //           res.status(200).send({
  //             success: 1,
  //             response: 200,
  //             message: 'SubTask updated successfully.',
  //             data: { ...updatedSubTask.dataValues, todoId: todo.id },
  //           });
  //         }
  //       }
  //     } else {
  //       winston.info(`No SubTask found with uuid ${req.params.id}`);
  //       next({
  //         msgCode: '0001',
  //         status: 404,
  //       });
  //     }
  //   } else {
  //     winston.info(`No Todo found with uuid ${req.params.id}`);
  //     next({
  //       msgCode: '0001',
  //       status: 404,
  //     });
  //   }
  // },
}