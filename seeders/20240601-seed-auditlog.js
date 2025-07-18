'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('AuditLogs', [
      {
        adminId: 1, // Super Admin
        action: 'CREATE_USER',
        targetId: 2, // Bob Driver
        targetType: 'User',
        details: JSON.stringify({ info: 'Created Bob Driver as user/driver' }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        adminId: 2, // Admin User
        action: 'APPROVE_DRIVER',
        targetId: 2, // Bob Driver
        targetType: 'User',
        details: JSON.stringify({ info: 'Approved Bob Driver as driver' }),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('AuditLogs', null, {});
  }
}; 