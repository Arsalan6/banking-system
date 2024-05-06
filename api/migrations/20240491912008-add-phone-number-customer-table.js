module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Customer', 'phoneNumber', {
      type: Sequelize.STRING,
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Customer', 'phoneNumber')
  }
};
