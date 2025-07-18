'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Disputes', [
      {
        rideId: 1,
        userId: 1, // Alice Admin
        description: 'Driver was late to the pickup location.',
        status: 'open',
        resolvedBy: null,
        resolvedAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        rideId: 2,
        userId: 3, // Charlie Support
        description: 'Vehicle was not clean.',
        status: 'open',
        resolvedBy: null,
        resolvedAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Disputes', null, {});
  }
}; 