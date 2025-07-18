'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      photo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      idCardImg: {
        type: Sequelize.STRING,
        allowNull: false
      },
      rating: {
        type: Sequelize.FLOAT,
        defaultValue: 5
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'unverified'
      },
      money: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'user'
      },
      driverStatus: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'none'
      },
      licenseNumber: {
        type: Sequelize.STRING,
        allowNull: true
      },
      driverDocuments: {
        type: Sequelize.JSON,
        allowNull: true
      },
      otp: {
        type: Sequelize.STRING,
        allowNull: true
      },
      otpExpiresAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
}; 