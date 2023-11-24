'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CategorySubgroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CategorySubgroup.belongsTo(models.Category, {
        foreignKey: {
          name: 'categoryId',
          allowNull: false,
        },
        as: 'category',
      });

      CategorySubgroup.hasMany(models.Subcategory, {
        foreignKey: {
          name: 'categorySubgroupId',
          allowNull: false,
        },
        as: 'subcategories',
      });
    }
  }
  CategorySubgroup.init(
    {
      subgroupName_en: DataTypes.STRING,
      subgroupName_mm: DataTypes.STRING,
      subgroupName_zh: DataTypes.STRING,
      subgroupImage: DataTypes.STRING,
      subgroupImageUrl: DataTypes.STRING,
      categoryId: DataTypes.STRING,
      key: DataTypes.INTEGER,
      sort: DataTypes.INTEGER,
      status: DataTypes.BOOLEAN,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'CategorySubgroup',
      paranoid: true,
    },
  );
  return CategorySubgroup;
};
