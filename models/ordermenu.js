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
      OrderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      MenuId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'OrderMenu',
    }
  );

  return OrderMenu;
};
