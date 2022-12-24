'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Attendances', 'date', {
      type: Sequelize.STRING
    })
    await queryInterface.changeColumn('Calenders', 'date', {
      type: Sequelize.STRING
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Attendances', 'date', {
      type: Sequelize.DATE
    })
    await queryInterface.changeColumn('Calenders', 'date', {
      type: Sequelize.DATE
    })
  }
};
