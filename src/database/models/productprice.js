'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductPrice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProductPrice.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product',
      });
    }
  }
  ProductPrice.init(
    {
      productId: DataTypes.INTEGER,
      unitPrice: DataTypes.INTEGER,
      stockQty: DataTypes.INTEGER,
      discountType: DataTypes.ENUM('PERCENT', 'FLAT'),
      discountAmount: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'ProductPrice',
    },
  );
  return ProductPrice;
};
