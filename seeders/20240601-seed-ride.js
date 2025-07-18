'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Rides', [
      {
        startLocation: 'Central Park',
        destination: 'Times Square',
        departureTime: new Date(Date.now() + 3600000),
        arrivalTime: new Date(Date.now() + 7200000),
        price: 20,
        seats: 3,
        status: 'open',
        createdBy: 2, // Bob Driver
        VehicleId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        startLocation: 'Empire State',
        destination: 'Brooklyn Bridge',
        departureTime: new Date(Date.now() + 10800000),
        arrivalTime: new Date(Date.now() + 14400000),
        price: 30,
        seats: 2,
        status: 'open',
        createdBy: 2, // Bob Driver
        VehicleId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Rides', null, {});
  }
}; 