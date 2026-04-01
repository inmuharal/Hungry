'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'UserId' });
      Order.belongsTo(models.Driver, { foreignKey: 'DriverId' });
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
          notEmpty: { msg: 'Nama pemesan tidak boleh kosong' },
          notNull: { msg: 'Nama pemesan wajib diisi' }
        }
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Alamat tidak boleh kosong' },
          notNull: { msg: 'Alamat wajib diisi' }
        }
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'User wajib dipilih' },
          isInt: { msg: 'UserId harus angka' }
        }
      },
      DriverId: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: { msg: 'DriverId harus angka' }
        }
      }
    },
    {
      sequelize,
      modelName: 'Order',
    }
  );

  return Order;
};