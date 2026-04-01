'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // One-to-One: satu user satu profile 
      User.hasOne(models.UserProfile, { foreignKey: 'userId' });
      // One-to-Many: Satu user banyak order
      User.hasMany(models.Order, { foreignKey: 'UserId' });
    }
  }

  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  return User;
};