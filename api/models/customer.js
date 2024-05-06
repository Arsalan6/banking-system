// Importing npm dependencies.
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: uuidv4(),
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        args: true,
      },
    },
    password: {
      type: DataTypes.STRING(100),
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
  Customer.associate = (models) => {
    Customer.hasMany(models.Account, {
      foreignKey: 'customerId',
    });
  };
  return Customer;
};
