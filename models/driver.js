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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Driver name is required" },
          notEmpty: { msg: "Driver name is required" },
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Driver phone number is required" },
          notEmpty: { msg: "Driver phone number is required" },
        },
      },
      license: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Driver license is required" },
          notEmpty: { msg: "Driver license is required" },
        },
      },
    },
    {
      sequelize,
      modelName: 'Driver',
    }
  );

  return Driver;
};
