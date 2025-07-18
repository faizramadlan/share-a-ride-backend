// models/dispute.js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Dispute = sequelize.define('Dispute', {
    rideId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Rides', key: 'id' }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'open'
    },
    resolvedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'Users', key: 'id' }
    },
    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {});
  Dispute.associate = function(models) {
    Dispute.belongsTo(models.Ride, { foreignKey: 'rideId' });
    Dispute.belongsTo(models.User, { foreignKey: 'userId', as: 'complainant' });
    Dispute.belongsTo(models.User, { foreignKey: 'resolvedBy', as: 'resolver' });
  };
  return Dispute;
}; 