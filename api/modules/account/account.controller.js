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
   * This method is used to create a new account for the logged in customer.
   * @param req
   * @param res
   * @param next
   */
  async createAccount(req, res, next) {
    winston.info(`Creating new account for customer with id: ${JSON.stringify(req.userId)}`);
    const accountObj = {
      uuid: uuidv4(),
      name: req.body.accountName,
      type: req.body.accountType,
      number: Math.floor(10000000 + Math.random() * 90000000), // Generating 8 digits random number.
      customerId: req.customerId,
    };
    const [errorCreatedAccount, createdAccount] = await to(dbConfig.getDbInstance().Account.create(accountObj));
    if (errorCreatedAccount) {
      winston.error(`Error occurred while creating account, ${errorCreatedAccount}`);
      next(errorCreatedAccount);
    } else {
      winston.info(`[${req.method}][${req.originalUrl}][${createdAccount.id}] Account created successfully`);
      res.status(200).send({
        success: 1,
        response: 200,
        message: 'Account created successfully.',
        data: {},
      });
    }
  },
}