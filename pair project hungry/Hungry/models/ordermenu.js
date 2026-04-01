'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderMenu extends Model {
    static associate(models) {
      // Junction table - no additional associations needed
    }
  }

  OrderMenu.init(
    {
      OrderId: DataTypes.INTEGER,
      MenuId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'OrderMenu',
    }
  );

  return OrderMenu;
};