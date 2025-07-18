'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // User email unique index (should already exist, but ensure)
    await queryInterface.addIndex('Users', ['email'], { unique: true, name: 'users_email_unique' });
    // Admin email unique index
    await queryInterface.addIndex('Admins', ['email'], { unique: true, name: 'admins_email_unique' });
    // Ride createdBy index
    await queryInterface.addIndex('Rides', ['createdBy'], { name: 'rides_createdBy_idx' });
    // Vehicle UserId index
    await queryInterface.addIndex('Vehicles', ['UserId'], { name: 'vehicles_userid_idx' });
    // Dispute rideId and userId indexes
    await queryInterface.addIndex('Disputes', ['rideId'], { name: 'disputes_rideid_idx' });
    await queryInterface.addIndex('Disputes', ['userId'], { name: 'disputes_userid_idx' });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Users', 'users_email_unique');
    await queryInterface.removeIndex('Admins', 'admins_email_unique');
    await queryInterface.removeIndex('Rides', 'rides_createdBy_idx');
    await queryInterface.removeIndex('Vehicles', 'vehicles_userid_idx');
    await queryInterface.removeIndex('Disputes', 'disputes_rideid_idx');
    await queryInterface.removeIndex('Disputes', 'disputes_userid_idx');
  }
}; 