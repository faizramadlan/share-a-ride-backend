// models/refreshToken.js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const RefreshToken = sequelize.define('RefreshToken', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' }
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    revokedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {});
  RefreshToken.associate = function(models) {
    RefreshToken.belongsTo(models.User, { foreignKey: 'userId' });
  };
  return RefreshToken;
}; 