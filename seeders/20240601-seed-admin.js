'use strict';

const bcrypt = require('../helpers/bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Admins', [
      {
        name: 'Super Admin',
        email: 'superadmin@test.com',
        password: bcrypt.create('test123'),
        role: 'superadmin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Admin User',
        email: 'admin@test.com',
        password: bcrypt.create('test123'),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Support Admin',
        email: 'support@test.com',
        password: bcrypt.create('test123'),
        role: 'support',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Admins', null, {});
  }
}; 