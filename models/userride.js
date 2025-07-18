"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserRide extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserRide.belongsTo(models.User, {
        foreignKey: "UserId",
      });
      UserRide.belongsTo(models.Ride, {
        foreignKey: "RideId",
      });
    }
  }
  UserRide.init(
    {
      UserId: DataTypes.INTEGER,
      RideId: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "UserRide",
    }
  );
  return UserRide;
};
