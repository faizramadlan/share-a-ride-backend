"use strict";
const Hash = require("../helpers/bcrypt");

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.UserRide, {
        foreignKey: "UserId",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
      User.hasOne(models.Vehicle, {
        foreignKey: "UserId",
      });
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Name is required" },
          notNull: { msg: "Name is required" },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Email is already used, please use another email",
        },
        validate: {
          notEmpty: { msg: "Email is required" },
          notNull: { msg: "Email is required" },
          isEmail: { msg: "Invalid email format" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Password is required" },
          notNull: { msg: "Password is required" },
          // len: {
          //   args: [5],
          //   msg: "Password minimum 5 characters",
          // },
          minChars(value) {
            if (value.length < 5) {
              throw new Error("Password minimum 5 characters");
            }
          },
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Phone number is required" },
          notNull: { msg: "Phone number is required" },
          is: {
            args: [/^\+?\d{9,15}$/],
            msg: "Phone number must be valid (9-15 digits, optional +)"
          }
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Address is required" },
          notNull: { msg: "Address is required" },
        },
      },
      photo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Photo is required" },
          notNull: { msg: "Photo is required" },
        },
      },
      idCardImg: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "ID card photo is required" },
          notNull: { msg: "ID card photo is required" },
        },
      },
      rating: {
        type: DataTypes.FLOAT,
        defaultValue: 5,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "unverified",
      },
      money: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "user",
        validate: {
          isIn: {
            args: [["user", "admin", "support"]],
            msg: "Role must be user, admin, or support"
          }
        }
      },
      driverStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "none",
        validate: {
          isIn: {
            args: [["none", "pending", "approved", "rejected"]],
            msg: "driverStatus must be one of none, pending, approved, rejected"
          }
        }
      },
      licenseNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      driverDocuments: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      // OTP fields for email verification
      otp: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      otpExpiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      hooks: {
        beforeCreate(user) {
          user.password = Hash.create(user.password);
        },
        beforeUpdate(user) {
          if (user.changed('password')) {
            user.password = Hash.create(user.password);
          }
        },
      },
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
