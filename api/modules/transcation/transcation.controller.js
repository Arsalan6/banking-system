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
   * This method is used to create a new transaction for the given account number.
   * @param req
   * @param res
   * @param next
   */
  async createTransaction(req, res, next) {
    winston.info(`Creating new transaction for account with id: ${JSON.stringify(req.userId)}`);
    const transactionObj = {
      uuid: uuidv4(),
      type: req.body.transactionType,
      amount: req.body.transactionAmount,
      accountId: req.body.accountId,
    };
    console.log(transactionObj);
    const [errorCreateTranscation, createdTranscation] = await to(dbConfig.getDbInstance().Transaction.create(transactionObj));
    if (errorCreateTranscation) {
      winston.error(`Error occurred while creating transcation, ${errorCreateTranscation}`);
      next(errorCreateTranscation);
    } else {
      winston.info(`[${req.method}][${req.originalUrl}][${createdTranscation.id}] Transcation created successfully`);
      winston.info(`Fetching customer account with id: ${req.body.accountId}.`);
      const [errorCustomerAccount, customerAccount] = await to(dbConfig.getDbInstance().Account.findOne({
        where: {
          id: req.body.accountId,
        }
      }));
      if (errorCustomerAccount) {
        winston.error(`Error occurred while fetching customer account, ${errorCustomerAccount}`);
        next(errorCustomerAccount);
      } else {
        winston.info(`Customer account with id: ${req.body.accountId} fetched successfully.`);
        winston.info(`Updating total amount in customer account table.`);
        let updatedAmount = req.body.transactionType === constants.transactionType.debit
          ? customerAccount.currentAmount - req.body.transactionAmount
          : customerAccount.currentAmount + req.body.transactionAmount;
        const [errorUpdatingAccount] = await to(dbConfig.getDbInstance().Account.update(
          { currentAmount: updatedAmount },
          {
            where: {
              id: req.body.accountId,
            }
          }
        ));
        if (errorUpdatingAccount) {
          winston.error(`Error occurred while updating total amount, ${errorUpdatingAccount}`);
          next(errorUpdatingAccount);
        } else {
          winston.info(`Total amount in customer account table updated successfully.`);
          res.status(200).send({
            success: 1,
            response: 200,
            message: 'Transcation created successfully.',
            data: {},
          });
        }
      }
    }
  },
}
