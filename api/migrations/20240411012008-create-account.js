// Importing app dependencies
const constants = require('../config/constants');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Account', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      number: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
      },
      uuid: {
        type: Sequelize.UUID,
        unique: true,
      },
      type: {
        type: Sequelize.ENUM(
          constants.accountType.business,
          constants.accountType.personal,
        ),
      },
      creditCardIssued: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      creditCardIssuedAt: {
        type: Sequelize.DATE
      },
      debitCardIssued: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      debitCardIssuedAt: {
        type: Sequelize.DATE
      },
      chequeBookIssued: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      chequeBookIssuedAt: {
        type: Sequelize.DATE
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
      customerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Customer',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Account');
  }
};