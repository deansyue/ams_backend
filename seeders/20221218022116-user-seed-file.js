'use strict';
const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const companies = await queryInterface.sequelize.query(
      'SELECT id FROM Companies;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    for (const company of companies) {
      await queryInterface.bulkInsert('Users',[{
        name: 'admin',
        account: 'admin',
        password: bcrypt.hashSync('tiadmin', bcrypt.genSaltSync(10)),
        email: 'admin@example.com',
        errTimes: 0,
        lock: false,
        role: 0,
        CompanyId: company.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'user1',
        account: 'user1',
        password: bcrypt.hashSync('titaner', bcrypt.genSaltSync(10)),
        email: 'user1@example.com',
        errTimes: 0,
        lock: false,
        role: 1,
        CompanyId: company.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'user2',
        account: 'user2',
        password: bcrypt.hashSync('titaner', bcrypt.genSaltSync(10)),
        email: 'user2@example.com',
        errTimes: 0,
        lock: false,
        role: 1,
        CompanyId: company.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'user3',
        account: 'user3',
        password: bcrypt.hashSync('titaner', bcrypt.genSaltSync(10)),
        email: 'user3@example.com',
        errTimes: 0,
        lock: false,
        role: 1,
        CompanyId: company.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }], {}
       )
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
