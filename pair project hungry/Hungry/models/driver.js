'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Driver extends Model {
    static associate(models) {
      // One-to-Many: Driver has many Orders
      Driver.hasMany(models.Order, { foreignKey: 'DriverId' });
    }
  }

  Driver.init(
    {
      name: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      license: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Driver',
    }
  );

  return Driver;
};