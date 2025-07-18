'use strict';

const bcrypt = require('../helpers/bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Alice Admin',
        email: 'alice.admin@example.com',
        password: bcrypt.create('adminpass'),
        phoneNumber: '+12345678901',
        address: '123 Admin St',
        photo: 'alice.png',
        idCardImg: 'alice-id.png',
        rating: 5,
        status: 'verified',
        money: 1000,
        role: 'admin',
        driverStatus: 'none',
        licenseNumber: null,
        driverDocuments: null,
        otp: null,
        otpExpiresAt: null,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Bob Driver',
        email: 'bob.driver@example.com',
        password: bcrypt.create('driverpass'),
        phoneNumber: '+12345678902',
        address: '456 Driver Rd',
        photo: 'bob.png',
        idCardImg: 'bob-id.png',
        rating: 4.8,
        status: 'verified',
        money: 500,
        role: 'user',
        driverStatus: 'approved',
        licenseNumber: 'DRV123456',
        driverDocuments: JSON.stringify({ license: 'bob-license.png', insurance: 'bob-insurance.png' }),
        otp: null,
        otpExpiresAt: null,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Charlie Support',
        email: 'charlie.support@example.com',
        password: bcrypt.create('supportpass'),
        phoneNumber: '+12345678903',
        address: '789 Support Ave',
        photo: 'charlie.png',
        idCardImg: 'charlie-id.png',
        rating: 5,
        status: 'verified',
        money: 0,
        role: 'support',
        driverStatus: 'none',
        licenseNumber: null,
        driverDocuments: null,
        otp: null,
        otpExpiresAt: null,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
}; 