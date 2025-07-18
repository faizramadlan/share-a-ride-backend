"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Ride extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Ride.hasMany(models.UserRide, {
        foreignKey: "RideId",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
      Ride.belongsTo(models.Vehicle);
    }
  }
  Ride.init(
    {
      startLocation: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Start location is required" },
          notNull: { msg: "Start location is required" },
        },
      },
      destination: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Destination point is required" },
          notNull: { msg: "Destination point is required" },
        },
      },
      departureTime: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Departure time is required" },
          notNull: { msg: "Departure time is required" },
        },
      },
      arrivalTime: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Estimation of arrival time is required" },
          notNull: { msg: "Estimation of arrival time is required" },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Price is required" },
        },
      },
      seats: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Total available seat is required" },
        },
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "open",
        validate: {
          isIn: {
            args: [["open", "in_progress", "completed", "cancelled"]],
            msg: "Status must be open, in_progress, completed, or cancelled"
          }
        }
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      VehicleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Ride",
    }
  );
  return Ride;
};
