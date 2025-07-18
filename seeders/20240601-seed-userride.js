'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('UserRides', [
      {
        UserId: 1, // Alice Admin
        RideId: 1,
        status: 'booked',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserId: 3, // Charlie Support
        RideId: 2,
        status: 'cancelled',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('UserRides', null, {});
  }
}; 