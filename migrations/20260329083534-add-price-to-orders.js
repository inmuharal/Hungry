'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('Orders');
    if (!table.price) {
      await queryInterface.addColumn('Orders', 'price', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('Orders');
    if (table.price) {
      await queryInterface.removeColumn('Orders', 'price');
    }
  },
};
