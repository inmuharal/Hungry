'use strict';
const { hashPassword } = require("../helpers/hash");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Alice',
        email: 'alice@food.com',
        password: hashPassword('password123'),
        role: 'penjual',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Budi',
        email: 'budi@food.com',
        password: hashPassword('password123'),
        role: 'pembeli',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
