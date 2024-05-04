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
   * This method is responsible fetching all customers.
   * @param req
   * @param res
   * @param next
   */
    async getAllCustomers(req, res, next) {
      winston.info('Fetching all customers from the database');
      const [error, customers] = await to(dbConfig.getDbInstance().Customer.findAll());
      if (error) {
        winston.error(`Error occurred while fetching all customers form database, ${error}`);
        next(error);
      } else {
        winston.info(`[${req.method}][${req.originalUrl}] Customers fetched successfully, total count: ${customers.length}`);
        res.status(200).send({
          success: 1,
          response: 200,
          message: customers.length ? 'Customers fetched successfully.' : 'No Customers found.',
          data: customers.length ? customers : [],
        });
      }
    },
}