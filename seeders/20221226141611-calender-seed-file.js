'use strict';
const calender2022 = require('../public/json/2022calender.json')
const calender2023 = require('../public/json/2023calender.json')


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Calenders',
      calender2022.map(x => ({
        date: x.西元日期.substring(0, 4) + '/' + x.西元日期.substring(4, 6) + '/' + x.西元日期.substring(6, 8),
        calFg: Number(x.是否放假),
        week: x.星期,
        rem: x.備註,
        createdAt: new Date(),
        updatedAt: new Date()
      }))  
    )

    await queryInterface.bulkInsert('Calenders',
      calender2023.map(x => ({
        date: x.西元日期.substring(0, 4) + '/' + x.西元日期.substring(4, 6) + '/' + x.西元日期.substring(6, 8),
        calFg: Number(x.是否放假),
        week: x.星期,
        rem: x.備註,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Calenders', null, []) 
  }
};
