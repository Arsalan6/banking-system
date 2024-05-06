// Importing app dependencies
const constants = require('../config/constants');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transaction', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.UUID,
        unique: true,
      },
      type: {
        type: Sequelize.ENUM(
          constants.transactionType.debit,
          constants.transactionType.credit,
        ),
      },
      amount: {
        type: Sequelize.INTEGER(100),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      },
      accountId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Account',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transaction');
  }
};