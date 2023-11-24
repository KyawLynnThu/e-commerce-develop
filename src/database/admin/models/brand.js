'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Brand extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  Brand.init(
    {
      brandName: DataTypes.STRING,
      brandImage: DataTypes.STRING,
      brandImageUrl: DataTypes.STRING,
      key: DataTypes.INTEGER,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Brand',
      paranoid: true,
    },
  );
  return Brand;
};
