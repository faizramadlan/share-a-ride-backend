'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('RefreshTokens', [
      {
        userId: 1, // Alice Admin
        token: 'sampletoken1',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        revokedAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2, // Bob Driver
        token: 'sampletoken2',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        revokedAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('RefreshTokens', null, {});
  }
}; 