'use strict';

const bcrypt = require('../helpers/bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Test Admin User',
        email: 'admin@test.com',
        password: bcrypt.create('test123'),
        phoneNumber: '+12345678900',
        address: '123 Test Street, Test City',
        photo: 'test-admin.png',
        idCardImg: 'test-admin-id.png',
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
        name: 'Test Driver User',
        email: 'driver@test.com',
        password: bcrypt.create('test123'),
        phoneNumber: '+12345678901',
        address: '456 Test Road, Test City',
        photo: 'test-driver.png',
        idCardImg: 'test-driver-id.png',
        rating: 4.8,
        status: 'verified',
        money: 500,
        role: 'user',
        driverStatus: 'approved',
        licenseNumber: 'TEST123456',
        driverDocuments: JSON.stringify({ license: 'test-license.png', insurance: 'test-insurance.png' }),
        otp: null,
        otpExpiresAt: null,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Test Support User',
        email: 'support@test.com',
        password: bcrypt.create('test123'),
        phoneNumber: '+12345678902',
        address: '789 Test Avenue, Test City',
        photo: 'test-support.png',
        idCardImg: 'test-support-id.png',
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