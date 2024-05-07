// Importing npm dependencies
const { v4: uuidv4 } = require('uuid');
const { to } = require('await-to-js');

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
      currentAmount: 0,
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
  /**
  * This method is used for fetching all accounts for the logged in customer.
  * @param req
  * @param res
  * @param next
  */
  async getAllCustomerAccounts(req, res, next) {
    winston.info(`Fetching all accounts for customer with id: ${JSON.stringify(req.customerId)}`);
    const [error, customerAccounts] = await to(dbConfig.getDbInstance().Account.findAll({
      attributes: [
        'id', 'uuid', 'name', 'number', 'currentAmount', 'creditCardIssued', 'creditCardIssuedAt', 'debitCardIssued',
        'debitCardIssuedAt', 'chequeBookIssued', 'chequeBookIssuedAt', 'type', 'createdAt'
      ],
      where: {
        customerId: req.customerId,
      }
    }));
    if (error) {
      winston.error(`Error occurred while fetching customer accounts, ${error}`);
      next(error);
    } else {
      winston.info(`[${req.method}][${req.originalUrl}] Accounts fetched successfully`);
      res.status(200).send({
        success: 1,
        response: 200,
        message: customerAccounts.length ? 'Accounts fetched successfully.' : 'No Accounts found.',
        data: customerAccounts.length ? customerAccounts : [],
      });
    }
  },
  /**
    * This method is responsible for deleting a account by its uuid.
    * @param req
    * @param res
    * @param next
    */
  async deleteAccountById(req, res, next) {
    winston.info(`Deleting account with uuid: ${JSON.stringify(req.params.id)}`);
    const [error, deletedAccount] = await to(dbConfig.getDbInstance().Account.destroy({
      where: {
        uuid: req.params.id,
      }
    }));
    if (error) {
      winston.error(`Error occurred while deleting account, ${error}`);
      next(error);
    } else if (!deletedAccount) {
      winston.info(`Account with uuid: ${JSON.stringify(req.params.id)} not found`);
      res.status(404).send({
        success: 1,
        response: 200,
        message: 'Account not found.',
        data: {},
      });
    } else {
      winston.info(`[${req.method}][${req.originalUrl}] Account deleted successfully`);
      res.status(200).send({
        success: 1,
        response: 200,
        message: 'Account deleted successfully.',
        data: {},
      });
    }
  },
  /**
  * This method is responsible for fetching a account by its number.
  * @param req
  * @param res
  * @param next
  */
  async getAccountByNumber(req, res, next) {
    winston.info(`Fetching account with uuid: ${JSON.stringify(req.params.accountNumber)}`);
    const [error, fetchedAccount] = await to(dbConfig.getDbInstance().Account.findOne({
      where: {
        number: req.params.accountNumber,
      },
      include: {
        model: dbConfig.getDbInstance().Customer,
        attributes: ['firstName', 'lastName', 'phoneNumber'],
      },
    }));
    if (error) {
      winston.error(`Error occurred while fetching account, ${error}`);
      next(error);
    } else if (!fetchedAccount) {
      winston.info(`Account with uuid: ${JSON.stringify(req.params.accountNumber)} not found`);
      res.status(404).send({
        success: 1,
        response: 200,
        message: 'Account not found.',
        data: {},
      });
    } else {
      winston.info(`[${req.method}][${req.originalUrl}] Account fetched successfully`);
      res.status(200).send({
        success: 1,
        response: 200,
        message: 'Account fetched successfully.',
        data: fetchedAccount,
      });
    }
  },
}
