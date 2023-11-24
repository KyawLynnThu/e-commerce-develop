'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Phone extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Phone.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'PhoneInfo',
      });
    }
  }
  Phone.init(
    {
      userId: DataTypes.INTEGER,
      phoneNumber: DataTypes.STRING(20),
      nationalFormat: DataTypes.STRING(50),
      countryCode: DataTypes.INTEGER,
      regionCode: DataTypes.STRING(10),
      isValid: DataTypes.BOOLEAN,
      possibleFormats: DataTypes.JSON,
    },
    {
      sequelize,
      modelName: 'Phone',
      paranoid: true,
    },
  );
  return Phone;
};
