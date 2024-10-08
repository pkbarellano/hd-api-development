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

    await queryInterface.bulkInsert('users', [
      {
        firstName: 'Firstname1',
        lastName: 'Lastname1',
        username: 'username1',
        password: encryptPassword('password1'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Firstname2',
        lastName: 'Lastname2',
        username: 'username2',
        password: encryptPassword('password2'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Firstname3',
        lastName: 'Lastname3',
        username: 'username3',
        password: encryptPassword('password3'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Firstname4',
        lastName: 'Lastname4',
        username: 'username4',
        password: encryptPassword('password4'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Firstname5',
        lastName: 'Lastname5',
        username: 'username5',
        password: encryptPassword('password5'),
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
    
    await queryInterface.bulkDelete('users', null, {});
  }
};
