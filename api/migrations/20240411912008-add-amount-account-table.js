module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Account', 'currentAmount', {
      type: Sequelize.INTEGER(100),
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Account', 'currentAmount')
  }
};
