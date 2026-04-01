'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
 
    await queryInterface.removeColumn('UserProfiles', 'email', Sequelize.STRING)
    await queryInterface.removeColumn('UserProfiles', 'password', Sequelize.STRING)
    
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.addColumn('UserProfiles', 'email', Sequelize.STRING)
    await queryInterface.addColumn('UserProfiles', 'password', Sequelize.STRING)
  }
};

