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

    await queryInterface.bulkInsert('agentConfigurations', [
      {
        agentId: 1,
        email: 'superuser@email.com',
        departmentId: 0,
        teamId: 0,
        groupId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        agentId: 2,
        email: 'agent@email.com',
        departmentId: 1,
        teamId: 0,
        groupId: 1,
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

    await queryInterface.bulkDelete('agentConfigurations', null, {});
  }
};
