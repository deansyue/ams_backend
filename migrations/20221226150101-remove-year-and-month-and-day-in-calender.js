'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Calenders', 'year')
    await queryInterface.removeColumn('Calenders', 'month')
    await queryInterface.removeColumn('Calenders', 'day')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('Calenders', 'year', Sequelize.INTEGER)
    await queryInterface.addColumn('Calenders', 'month', Sequelize.INTEGER)
    await queryInterface.addColumn('Calenders', 'day', Sequelize.INTEGER)
  }
};
