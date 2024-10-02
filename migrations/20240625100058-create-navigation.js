'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Navigations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      panel: {
        type: Sequelize.STRING,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      label: {
        type: Sequelize.STRING,
        allowNull: false
      },
      url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      hasMenu: {
        type: Sequelize.STRING,
        allowNull: false
      },
      hasSub: {
        type: Sequelize.STRING,
        allowNull: false
      },
      firstLevel: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      secondLevel: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      thirdLevel: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      menuOrder: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      icon: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Navigations');
  }
};