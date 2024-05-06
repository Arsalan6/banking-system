// Importing npm dependencies.
const { v4: uuidv4 } = require('uuid');

// Importing app dependencies
const constants = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: uuidv4(),
    },
    type: {
      type: DataTypes.ENUM(
        constants.transactionType.debit,
        constants.transactionType.credit,
      ),
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER(100),
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  }, {
    freezeTableName: true,
    timestamps: true,
    paranoid: true
  });
  Transaction.associate = function (models) {
    Transaction.belongsTo(models.Account, {
      foreignKey: 'accountId',
    });
  };
  return Transaction;
};
