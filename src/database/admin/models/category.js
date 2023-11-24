'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Category.hasMany(models.CategorySubgroup, {
        foreignKey: {
          name: 'categoryId',
          allowNull: false, // Cascade deletion
        },
        as: 'categorysubgroups',
      });
    }
  }
  Category.init(
    {
      categoryName_en: DataTypes.STRING,
      categoryName_mm: DataTypes.STRING,
      categoryName_zh: DataTypes.STRING,
      categoryIcon: DataTypes.STRING,
      categoryImageUrl: DataTypes.STRING,
      key: DataTypes.INTEGER,
      sort: DataTypes.INTEGER,
      status: DataTypes.BOOLEAN,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Category',
      paranoid: true,
    },
  );
  return Category;
};
