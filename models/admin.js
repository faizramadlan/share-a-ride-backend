"use strict";
const Hash = require("../helpers/bcrypt");

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Admin.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Name is required",
          },
          notEmpty: {
            msg: "Name is required",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "Email must be unique",
        },
        validate: {
          notNull: {
            msg: "Email is required",
          },
          notEmpty: {
            msg: "Email is required",
          },
          isEmail: {
            msg: "Invalid email format",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Password is required",
          },
          notEmpty: {
            msg: "Password is required",
          },
          minChars(value) {
            if (value.length < 8) {
              throw new Error("Password must be at least 8 characters");
            }
          },
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "admin",
        validate: {
          isIn: {
            args: [["admin", "superadmin", "support"]],
            msg: "Role must be admin, superadmin, or support"
          }
        }
      },
    },
    {
      hooks: {
        beforeCreate(admin) {
          admin.password = Hash.create(admin.password);
        },
      },
      sequelize,
      modelName: "Admin",
    }
  );
  return Admin;
};
