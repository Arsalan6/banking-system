// Importing npm dependencies
const { v4: uuidv4 } = require('uuid');
const { to } = require('await-to-js')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Importing app dependencies
const winston = require('../../config/winston');
const dbConfig = require('../../config/db-config');
const constants = require('../../config/constants');
const { Op } = require('sequelize');

module.exports = {
  /**
   * This method is used to create a new transaction for the given account number.
   * @param req
   * @param res
   * @param next
   */
  async createTransaction(req, res, next) {
    winston.info(`Creating new transaction for account with id: ${JSON.stringify(req.customerId)}`);
    const transactionObj = {
      uuid: uuidv4(),
      type: req.body.transactionType,
      amount: req.body.transactionAmount,
      accountId: req.body.accountId,
    };
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
  /**
   * This method is used to fetch al transaction for the logged in user.
   * @param req
   * @param res
   * @param next
   */
  async getAllTransactions(req, res, next) {
    winston.info(`Fetching all transactions for user with id: ${JSON.stringify(req.customerId)}`);
    winston.info(`Fetching all accounts for customer with id: ${JSON.stringify(req.customerId)}`);
    const [errorAccounts, accounts] = await to(dbConfig.getDbInstance().Account.findAll({
      attributes: ['id', 'number'],
      where: { customerId: req.customerId }
    }));
    if (errorAccounts) {
      winston.error(`Error occurred while fetching customer accounts, ${errorAccounts}`);
      next(errorAccounts);
    } else {
      winston.info(`Accounts fetched successfully`);
      const { q: queryParam } = req.query;
      const accountIds = accounts.map((account) => account.id)
      const [errorTransactions, transactions] = await to(dbConfig.getDbInstance().Transaction.findAll({
        attributes: [
          'id', 'uuid', 'amount', 'createdAt', 'type', 'accountId'
        ],
        include: {
          model: dbConfig.getDbInstance().Account,
          attributes: [
            'id', 'uuid', 'name', 'number', 'currentAmount', 'creditCardIssued', 'creditCardIssuedAt', 'debitCardIssued',
            'debitCardIssuedAt', 'chequeBookIssued', 'chequeBookIssuedAt', 'type', 'createdAt'
          ],
        },
        where:
          [{ accountId: accountIds },
          {
            [Op.or]: [
              { amount: { [Op.like]: `%${queryParam}%` } },
              { type: { [Op.like]: `%${queryParam}%` } },
            ],
          }],
      }));
      if (errorTransactions) {
        winston.error(`Error occurred while fetching customer transactions, ${errorTransactions}`);
        next(errorTransactions);
      } else {
        winston.info(`[${req.method}][${req.originalUrl}] transactions fetched successfully`);
        res.status(200).send({
          success: 1,
          response: 200,
          message: transactions.length ? 'transactions fetched successfully.' : 'No transactions found.',
          data: {
            transactions: transactions.length ? transactions : [],
            accounts: accounts,
          },
        });
      }
    }
  },
  /**
   * This method is used to transfer funds from one account to another.
   * @param req
   * @param res
   * @param next
   */
  async transferFunds(req, res, next) {
    const { recipientId, donorId, transactionAmount } = req.body;
    winston.info(`Transfering amount from user with id: ${JSON.stringify(donorId)} to account ${recipientId}`);
    winston.info(`Fetching account with uuid: ${recipientId}`);
    const [error, fetchedAccounts] = await to(dbConfig.getDbInstance().Account.findAll({
      where: {
        uuid: [recipientId, donorId],
      },
      include: {
        model: dbConfig.getDbInstance().Customer,
      }
    }));
    if (error) {
      winston.error(`Error occurred while fetching customer account, ${error}`);
      next(error);
    } else if (fetchedAccounts.length != 2) {
      winston.info(`Account not found`);
      res.status(404).send({
        success: 1,
        response: 200,
        message: 'Account not found.',
        data: {},
      });
    } else {
      const transactionObjArr = [
        {
          uuid: uuidv4(),
          type: constants.transactionType.debit,
          amount: transactionAmount,
          accountId: fetchedAccounts.find((acc) => acc.uuid === donorId).id,
        },
        {
          uuid: uuidv4(),
          type: constants.transactionType.credit,
          amount: transactionAmount,
          accountId: fetchedAccounts.find((acc) => acc.uuid === recipientId).id,
        }
      ];
      const [errorCreateTranscation] = await to(dbConfig.getDbInstance().Transaction.bulkCreate(transactionObjArr));
      if (errorCreateTranscation) {
        winston.error(`Error occurred while creating transcations, ${errorCreateTranscation}`);
        next(errorCreateTranscation);
      } else {
        winston.info(`Transcation created successfully`);
        winston.info(`Updating total amount in customers account table.`);
        const donorTotalAmount = fetchedAccounts.find((acc) => acc.uuid === donorId).currentAmount - transactionAmount;
        const [errorUpdatingDonorTotalAmount] = await to(dbConfig.getDbInstance().Account.update(
          { currentAmount: donorTotalAmount },
          {
            where: {
              id: fetchedAccounts.find((acc) => acc.uuid === donorId).id,
            }
          }
        ));
        if (errorUpdatingDonorTotalAmount) {
          winston.error(`Error occurred while updating total amount for donor account, ${errorUpdatingDonorTotalAmount}`);
          next(errorUpdatingDonorTotalAmount);
        } else {
          winston.info(`Total amount for donor account updated successfully.`);
          const recipientTotalAmount = fetchedAccounts.find((acc) => acc.uuid === recipientId).currentAmount + transactionAmount;
          const [errorUpdatingRecipientTotalAmount] = await to(dbConfig.getDbInstance().Account.update(
            { currentAmount: recipientTotalAmount },
            {
              where: {
                id: fetchedAccounts.find((acc) => acc.uuid === recipientId).id,
              }
            }
          ));
          if (errorUpdatingRecipientTotalAmount) {
            winston.error(`Error occurred while updating total amount for recipient account, ${errorUpdatingRecipientTotalAmount}`);
            next(errorUpdatingRecipientTotalAmount);
          } else {
            winston.info(`Total amount for recipient account updated successfully.`);
            res.status(200).send({
              success: 1,
              response: 200,
              message: 'Amount transferred successfully.',
              data: fetchedAccounts,
            });
          }
        }
      }
    }
  },
}
