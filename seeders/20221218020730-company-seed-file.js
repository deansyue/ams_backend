'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Companies', [{
      name: '出勤系統測試股份有限公司',
      address: '220新北市板橋區四川路二段47巷2弄2號',
      latitude: 24.995001,
      longitude: 121.454042,
      useGps: false,
      area: 'Asia/Taipei',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Companies', null, {})
  }
};
