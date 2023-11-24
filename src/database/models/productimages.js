'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductImages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProductImages.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product',
      });
    }
  }
  ProductImages.init(
    {
      productId: DataTypes.INTEGER,
      productImage: DataTypes.STRING,
      productImageUrl: DataTypes.STRING,
      sort: DataTypes.INTEGER,
      fileType: DataTypes.STRING,
      fileName: DataTypes.STRING,
      fileSize: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'ProductImages',
    },
  );
  return ProductImages;
};
