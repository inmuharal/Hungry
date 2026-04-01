'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const orders = await queryInterface.sequelize.query(
      `SELECT id, name FROM "Orders" WHERE name = 'Order Perdana'`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const menus = await queryInterface.sequelize.query(
      `SELECT id, menu FROM "Menus" WHERE menu IN ('Nasi Goreng Spesial', 'Mie Ayam Bakso')`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const orderId = orders[0]?.id;
    const menuMap = Object.fromEntries(menus.map((menu) => [menu.menu, menu.id]));

    await queryInterface.bulkInsert("OrderMenus", [
      {
        OrderId: orderId,
        MenuId: menuMap["Nasi Goreng Spesial"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        OrderId: orderId,
        MenuId: menuMap["Mie Ayam Bakso"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("OrderMenus", null, {});
  },
};
