'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Media extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Media.belongsTo(models.User, {
        foreignKey: 'mediableId',
        as: 'UserMedias',
      });
    }
  }
  Media.init(
    {
      mediableType: DataTypes.STRING,
      mediableId: DataTypes.INTEGER,
      fileType: DataTypes.STRING,
      fileName: DataTypes.STRING,
      fileSize: DataTypes.STRING,
      filePath: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Media',
      paranoid: true,
    },
  );
  return Media;
};
