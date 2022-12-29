'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Companies', 'useGps', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    })
    await queryInterface.addColumn('Companies', 'latitude', Sequelize.DOUBLE)
    await queryInterface.addColumn('Companies', 'longitude', Sequelize.DOUBLE)
    await queryInterface.addColumn('Companies', 'area', {
      type: Sequelize.STRING,
      defaultValue: 'Asia/Taipei'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Companies', 'useGps')
    await queryInterface.removeColumn('Companies', 'latitude')
    await queryInterface.removeColumn('Companies', 'longitude')
    await queryInterface.removeColumn('Companies', 'area')
  }
};
