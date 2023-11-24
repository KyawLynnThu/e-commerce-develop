'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      categoryId: {
        type: Sequelize.INTEGER,
      },
      subgroupId: {
        type: Sequelize.INTEGER,
      },
      subcategoryId: {
        type: Sequelize.INTEGER,
      },
      brandId: {
        type: Sequelize.INTEGER,
      },
      productSKU: {
        type: Sequelize.STRING,
      },
      sellerId: {
        type: Sequelize.INTEGER,
      },
      productStatus: {
        type: Sequelize.ENUM,
        values: ['REQUESTED', 'PENDING', 'APPROVED', 'REJECTED', 'BANNED'],
        allowNull: false,
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
    await queryInterface.dropTable('Products');
  },
};
