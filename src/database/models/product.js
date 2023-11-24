'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasMany(models.ProductImages, {
        foreignKey: 'productId',
        as: 'productImages',
      });

      Product.hasMany(models.ProductTranslation, {
        foreignKey: 'productId',
        as: 'productTranslation',
      });

      Product.hasOne(models.ProductPrice, {
        foreignKey: 'productId',
        as: 'productPrice',
      });

      Product.hasMany(models.ProductVariation, {
        foreignKey: 'productId',
        as: 'productVariation',
      });
    }
  }
  Product.init(
    {
      categoryId: DataTypes.INTEGER,
      subgroupId: DataTypes.INTEGER,
      subcategoryId: DataTypes.INTEGER,
      brandId: DataTypes.INTEGER,
      productSKU: DataTypes.STRING,
      sellerId: DataTypes.INTEGER,
      productStatus: DataTypes.ENUM(
        'REQUESTED',
        'PENDING',
        'APPROVED',
        'REJECTED',
        'BANNED',
      ),
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Product',
      paranoid: true,
    },
  );
  return Product;
};
