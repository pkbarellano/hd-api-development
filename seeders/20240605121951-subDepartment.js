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

    await queryInterface.bulkInsert('subDepartments', [
      {
        subDepartmentName: 'Test Department 1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        subDepartmentName: 'Test Department 2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        subDepartmentName: 'Test Department 3',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        subDepartmentName: 'Test Department 4',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        subDepartmentName: 'Test Department 5',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        subDepartmentName: 'Test Department 6',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        subDepartmentName: 'Test Department 7',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        subDepartmentName: 'Test Department 8',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        subDepartmentName: 'Test Department 9',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        subDepartmentName: 'Test Department 10',
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

    await queryInterface.bulkDelete('subDepartments', null, {});
  }
};
