/* eslint-disable no-unused-vars */
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Profile
      User.hasOne(models.UserProfile, {
        foreignKey: 'userId',
        as: 'Profile',
        onDelete: 'CASCADE',
        hooks: false,
      });

      User.hasOne(models.Phone, {
        foreignKey: 'userId',
        as: 'Phone',
        onDelete: 'CASCADE',
        hooks: false,
      });

      User.hasMany(models.Media, {
        foreignKey: 'mediableId',
        as: 'UserMedias',
        onDelete: 'CASCADE',
        hooks: false,
      });
    }
  }
  User.init(
    {
      accountId: DataTypes.BIGINT,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      nickName: DataTypes.STRING,
      uniqueName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      accountStatus: DataTypes.STRING,
      userType: DataTypes.STRING,
      deviceToken: DataTypes.TEXT,
      authToken: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
      paranoid: true,
    },
  );
  return User;
};
