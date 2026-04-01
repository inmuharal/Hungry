'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // One-to-Many: Order belongs to User
      Order.belongsTo(models.User, { foreignKey: 'UserId' });
      // One-to-Many: Order belongs to Driver
      Order.belongsTo(models.Driver, { foreignKey: 'DriverId' });
      // Many-to-Many: Order belongs to many Menus through OrderMenu
      Order.belongsToMany(models.Menu, {
        through: models.OrderMenu,
        foreignKey: 'OrderId',
      });
    }
  }

  Order.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Order name is required" },
          notEmpty: { msg: "Order name is required" },
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Address is required" },
          notEmpty: { msg: "Address is required" },
          isAddressLengthValid(value) {
            const length = (value || "").trim().length;
            if (length < 15 || length > 255) {
              throw new Error("Address must be between 15 and 255 characters");
            }
          },
        },
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "User is required for order" },
        },
      },
      DriverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Driver is required for order" },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: { args: [1000], msg: "Price minimum is 1000" },
        },
      },
    },
    {
      sequelize,
      modelName: 'Order',
      hooks: {
        afterDestroy(Order) {
          Order.lastDeleteMessage = "Pesanan berhasil dihapus";
        },
      },
    }
  );

  return Order;
};
