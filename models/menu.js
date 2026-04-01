'use strict';
const { Model } = require('sequelize');
const { Op } = require("sequelize");
const { formatRupiah } = require("../helpers/format");

module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    static associate(models) {
      // Many-to-Many: Menu belongs to many Orders through OrderMenu
      Menu.belongsToMany(models.Order, {
        through: models.OrderMenu,
        foreignKey: 'MenuId',
      });
    }

    static findAllWithFilter({ search, sort }) {
      const where = {};

      if (search) {
        where[Op.or] = [
          { menu: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
        ];
      }

      const order = [];
      if (sort === "price_asc") order.push(["price", "ASC"]);
      if (sort === "price_desc") order.push(["price", "DESC"]);
      if (!order.length) order.push(["updatedAt", "DESC"]);

      return Menu.findAll({ where, order });
    }

    get priceToRupiah() {
      return formatRupiah(this.price);
    }
  }

  Menu.init(
    {
      menu: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Menu name is required" },
          notEmpty: { msg: "Menu name is required" },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Price is required" },
          notEmpty: { msg: "Price is required" },
          min: { args: [1000], msg: "Price minimum is 1000" },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Description is required" },
          notEmpty: { msg: "Description is required" },
          len: { args: [10, 255], msg: "Description minimum 10 characters" },
        },
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Image URL is required" },
          notEmpty: { msg: "Image URL is required" },
          isUrl: { msg: "Image URL must be valid" },
        },
      },
    },
    {
      sequelize,
      modelName: 'Menu',
    }
  );

  return Menu;
};
