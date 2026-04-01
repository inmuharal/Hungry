'use strict';
const { hashPassword } = require("../helpers/hash");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      `SELECT id, email FROM "Users" WHERE email IN ('alice@food.com', 'budi@food.com')`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const userMap = Object.fromEntries(users.map((user) => [user.email, user.id]));

    await queryInterface.bulkInsert("UserProfiles", [
      {
        name: "Alice Penjual",
        phoneNumber: "089876543210",
        email: "alice@food.com",
        password: hashPassword("password123"),
        userId: userMap["alice@food.com"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Budi Pembeli",
        phoneNumber: "081122334455",
        email: "budi@food.com",
        password: hashPassword("password123"),
        userId: userMap["budi@food.com"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("UserProfiles", null, {});
  },
};
