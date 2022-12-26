'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Calenders', 'week', Sequelize.STRING)
    await queryInterface.addColumn('Calenders', 'rem', Sequelize.STRING)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Calenders', 'week')
    await queryInterface.removeColumn('Calenders', 'rem')
  }
};
