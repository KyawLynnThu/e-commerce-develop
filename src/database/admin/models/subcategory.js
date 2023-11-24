'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subcategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Subcategory.belongsTo(models.CategorySubgroup, {
        foreignKey: {
          name: 'categorySubgroupId',
          allowNull: false,
        },
        as: 'categorysubgroup',
      });
    }
  }
  Subcategory.init(
    {
      subcategoryName_en: DataTypes.STRING,
      subcategoryName_mm: DataTypes.STRING,
      subcategoryName_zh: DataTypes.STRING,
      categorySubgroupId: DataTypes.INTEGER,
      subcategoryImage: DataTypes.STRING,
      subcategoryImageUrl: DataTypes.STRING,
      key: DataTypes.INTEGER,
      sort: DataTypes.INTEGER,
      status: DataTypes.BOOLEAN,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Subcategory',
      paranoid: true,
    },
  );
  return Subcategory;
};
