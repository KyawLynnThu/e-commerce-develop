'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductVariation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProductVariation.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product',
      });
    }
  }
  ProductVariation.init(
    {
      productId: DataTypes.INTEGER,
      colorCode: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'ProductVariation',
    },
  );
  return ProductVariation;
};
