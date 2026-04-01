'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Drivers", [
      {
        name: "Rudi",
        phoneNumber: "081234567890",
        license: "SIMC-001",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Beni",
        phoneNumber: "081223344556",
        license: "SIMC-002",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Tutung",
        phoneNumber: "081578888765",
        license: "SIMC-003",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Ateng",
        phoneNumber: "0816766008912",
        license: "SIMC-004",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Drivers", null, {});
  },
};
