'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Vehicles', [
      {
        type: 'Sedan',
        plateNumber: 'ABC123',
        status: 'active',
        UserId: 2, // Bob Driver
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'SUV',
        plateNumber: 'XYZ789',
        status: 'pending_approval',
        UserId: 2, // Bob Driver
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Vehicles', null, {});
  }
}; 