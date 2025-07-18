// __test__/dispute.test.js
const app = require('../app');
const request = require('supertest');
const { sequelize, User, Ride, Dispute } = require('../models');
let userToken, supportToken, rideId, disputeId;

beforeAll(async () => {
  // Create a user and a support user, and a ride
  const user = await User.create({
    name: 'Dispute User',
    email: 'disputeuser@mail.com',
    password: 'password',
    phoneNumber: '+628123456789',
    address: 'Test Address',
    photo: 'photo.png',
    idCardImg: 'idcard.png',
    isVerified: true,
    role: 'user'
  });
  const support = await User.create({
    name: 'Support User',
    email: 'supportuser@mail.com',
    password: 'password',
    phoneNumber: '+628987654321',
    address: 'Support Address',
    photo: 'photo.png',
    idCardImg: 'idcard.png',
    isVerified: true,
    role: 'support'
  });
  const ride = await Ride.create({
    startLocation: 'A',
    destination: 'B',
    departureTime: new Date(),
    arrivalTime: new Date(Date.now() + 3600000),
    price: 10000,
    seats: 3,
    createdBy: user.id,
    VehicleId: 1,
    status: 'active'
  });
  rideId = ride.id;
  // Login to get tokens
  const userRes = await request(app).post('/users/login').send({ email: user.email, password: 'password' });
  userToken = userRes.body.access_token;
  const supportRes = await request(app).post('/users/login').send({ email: support.email, password: 'password' });
  supportToken = supportRes.body.access_token;
});

afterAll(async () => {
  await Dispute.destroy({ where: {} });
  await Ride.destroy({ where: {} });
  await User.destroy({ where: { email: ['disputeuser@mail.com', 'supportuser@mail.com'] } });
});

describe('Dispute Endpoints', () => {
  it('User can create a dispute for a ride', async () => {
    const res = await request(app)
      .post(`/rides/${rideId}/disputes`)
      .set('access_token', userToken)
      .send({ description: 'Test dispute' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    disputeId = res.body.id;
  });

  it('Support can view all disputes', async () => {
    const res = await request(app)
      .get('/disputes')
      .set('access_token', supportToken);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('Support can view dispute details', async () => {
    const res = await request(app)
      .get(`/disputes/${disputeId}`)
      .set('access_token', supportToken);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', disputeId);
  });

  it('Support can resolve a dispute', async () => {
    const res = await request(app)
      .patch(`/disputes/${disputeId}/resolve`)
      .set('access_token', supportToken);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Dispute resolved');
  });

  it('User cannot resolve a dispute', async () => {
    const res = await request(app)
      .patch(`/disputes/${disputeId}/resolve`)
      .set('access_token', userToken);
    expect(res.status).toBe(403);
  });

  it('Support cannot create a dispute', async () => {
    const res = await request(app)
      .post(`/rides/${rideId}/disputes`)
      .set('access_token', supportToken)
      .send({ description: 'Should not work' });
    // Should fail because only users can create
    expect(res.status).toBe(403);
  });
}); 