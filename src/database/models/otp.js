/* eslint-disable no-unused-vars */
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Otp extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Otp.init(
    {
      phone: DataTypes.STRING,
      client_ref: DataTypes.STRING,
      otp: DataTypes.INTEGER,
      isVerify: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Otp',
    },
  );
  return Otp;
};
