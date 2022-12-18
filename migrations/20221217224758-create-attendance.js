'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Attendances', {
      UserId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      date: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DATE
      },
      workTime: {
        type: Sequelize.DATE
      },
      offTime: {
        type: Sequelize.DATE
      },
      attMode: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      workGps: {
        type: Sequelize.STRING
      },
      offGps: {
        type: Sequelize.STRING
      },
      attFg: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Attendances');
  }
};