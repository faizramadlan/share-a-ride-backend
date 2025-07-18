"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AuditLog extends Model {
    static associate(models) {
      AuditLog.belongsTo(models.Admin, { foreignKey: "adminId" });
    }
  }
  AuditLog.init(
    {
      adminId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      targetId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      targetType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      details: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "AuditLog",
    }
  );
  return AuditLog;
}; 