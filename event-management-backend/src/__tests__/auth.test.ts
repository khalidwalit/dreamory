import request from 'supertest';
import app from '../app'
import mongoose from 'mongoose';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
});

afterAll(async () => {
  await mongoose.connection.close();  

});

describe('Authentication API', () => {
  it('should register a user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test1@example.com', password: 'password123' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'User registered successfully');
    expect(response.body).toHaveProperty('userId'); // Only if your API returns userId
  });

  it('should not allow duplicate registrations', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test1@example.com', password: 'password123' });

    expect(response.status).toBe(400); // Assuming your API returns 400 for duplicates
    expect(response.body).toHaveProperty('message', 'Email is already in use'); // Adjust based on your API response
  });

  it('should log in a user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test1@example.com', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
