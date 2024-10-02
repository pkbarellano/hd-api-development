'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert('flags', [
      {
        flagName: 'Open',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        flagName: 'Waiting',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        flagName: 'Resolved',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        flagName: 'Closed',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('flags', null, {});
  }
};
