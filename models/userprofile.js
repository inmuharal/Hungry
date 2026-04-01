'use strict';
const { Model } = require('sequelize');
const { hashPassword } = require("../helpers/hash");

module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    static associate(models) {
      // One-to-One: UserProfile belongs to User
      UserProfile.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  UserProfile.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Profile name is required" },
          notEmpty: { msg: "Profile name is required" },
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Phone number is required" },
          notEmpty: { msg: "Phone number is required" },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Profile email is required" },
          notEmpty: { msg: "Profile email is required" },
          isEmail: { msg: "Profile email format is invalid" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "User is required for profile" },
        },
      },
    },
    {
      sequelize,
      modelName: 'UserProfile',
      hooks: {
        beforeCreate(profile) {
          profile.password = hashPassword(profile.password);
        },
      },
    }
  );

  return UserProfile;
};
