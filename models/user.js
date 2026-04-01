'use strict';
const { Model } = require('sequelize');
const { hashPassword, comparePassword } = require("../helpers/hash");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // One-to-One: satu user satu profile 
      User.hasOne(models.UserProfile, { foreignKey: 'userId' });
      // One-to-Many: Satu user banyak order
      User.hasMany(models.Order, { foreignKey: 'UserId' });
    }

    static findByEmail(email) {
      return User.findOne({ where: { email } });
    }

    checkPassword(password) {
      return comparePassword(password, this.password);
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Name is required" },
          notEmpty: { msg: "Name is required" },
          len: { args: [3, 50], msg: "Name minimum 3 characters" },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Email already registered" },
        validate: {
          notNull: { msg: "Email is required" },
          notEmpty: { msg: "Email is required" },
          isEmail: { msg: "Email format is invalid" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Password is required" },
          notEmpty: { msg: "Password is required" },
          len: { args: [6, 100], msg: "Password minimum 6 characters" },
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pembeli",
        validate: {
          isIn: {
            args: [["penjual", "pembeli"]],
            msg: "Role must be penjual or pembeli",
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
      hooks: {
        beforeCreate(user) {
          user.password = hashPassword(user.password);
        },
        beforeUpdate(user) {
          if (user.changed("password")) {
            user.password = hashPassword(user.password);
          }
        },
      },
    }
  );

  return User;
};
