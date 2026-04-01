'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    static associate(models) {
      // One-to-One: UserProfile belongs to User
      UserProfile.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  UserProfile.init(
    {
      name: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'UserProfile',
    }
  );

  return UserProfile;
};