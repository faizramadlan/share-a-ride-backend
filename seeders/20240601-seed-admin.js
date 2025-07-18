'use strict';

const bcrypt = require('../helpers/bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Admins', [
      {
        name: 'Super Admin',
        email: 'superadmin@example.com',
        password: bcrypt.create('superadminpass'),
        role: 'superadmin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: bcrypt.create('adminpass'),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Support Admin',
        email: 'supportadmin@example.com',
        password: bcrypt.create('supportpass'),
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