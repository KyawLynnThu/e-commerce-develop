'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserProfile.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'UserInfo',
      });
    }
  }
  UserProfile.init(
    {
      userId: DataTypes.INTEGER,
      birthDate: DataTypes.DATE,
      region: DataTypes.STRING,
      city: DataTypes.STRING,
      township: DataTypes.STRING,
      gender: DataTypes.STRING,
      profileImageUrl: DataTypes.STRING,
      coverImageUrl: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'UserProfile',
      paranoid: true,
    },
  );
  return UserProfile;
};
