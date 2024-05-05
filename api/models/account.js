// Importing npm dependencies.
const { v4: uuidv4 } = require('uuid');

// Importing app dependencies
const constants = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: uuidv4(),
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    number: {
      type: DataTypes.INTEGER(100),
      allowNull: false,
    },
    currentAmount: {
      type: DataTypes.INTEGER(100),
      allowNull: false,
    },
    creditCardIssued: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    creditCardIssuedAt: {
      type: DataTypes.DATE,
    },
    debitCardIssued: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    debitCardIssuedAt: {
      type: DataTypes.DATE,
    },
    chequeBookIssued: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    chequeBookIssuedAt: {
      type: DataTypes.DATE,
    },
    type: {
      type: DataTypes.ENUM(
        constants.accountType.personal,
        constants.accountType.business,
      ),
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
  Account.associate = function (models) {
    Account.belongsTo(models.Customer, {
      foreignKey: 'customerId',
    });
  };
  return Account;
};
