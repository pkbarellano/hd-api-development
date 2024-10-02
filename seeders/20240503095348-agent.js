'use strict';
const { encryptPassword } = require('../helpers/bcrypt.helper');


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

    await queryInterface.bulkInsert('agents', [
      {
        firstName: 'Super',
        lastName: 'User',
        username: 'superuser',
        password: encryptPassword('password'),
        isSuperUser: 'Y',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Agentfirstname',
        lastName: 'Agentlastname',
        username: 'username',
        password: encryptPassword('password'),
        isSuperUser: 'N',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('Agents', null, {});
  }
};
