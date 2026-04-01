'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      `SELECT id, email FROM "Users" WHERE email = 'budi@food.com'`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const drivers = await queryInterface.sequelize.query(
      `SELECT id, name FROM "Drivers" WHERE name = 'Rudi'`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const userId = users[0]?.id;
    const driverId = drivers[0]?.id;

    await queryInterface.bulkInsert("Orders", [
      {
        name: "Order Perdana",
        address: "Jl. Sudirman No. 10",
        UserId: userId,
        DriverId: driverId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Orders", null, {});
  },
};
