'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserProfiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      birthDate: {
        type: Sequelize.DATE,
      },
      region: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      township: {
        type: Sequelize.STRING,
      },
      gender: {
        type: Sequelize.STRING,
      },
      profileImageUrl: {
        type: Sequelize.STRING,
      },
      coverImageUrl: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('UserProfiles');
  },
};
