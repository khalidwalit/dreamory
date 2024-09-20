import request from 'supertest';
import app from '../app'; // Adjust the import based on your project structure
import mongoose from 'mongoose';

let token: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

  // Log in to get a token for authenticated requests
  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({ email: 'test1@example.com', password: 'password123' });

  token = loginResponse.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Event Management API', () => {
  it('should create an event', async () => {
    const response = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Event',
        startDate: new Date(),
        endDate: new Date(),
        location: 'Sample Location',
        thumbnail: "https://example.com/new-thumbnail.jpg",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('name', 'Test Event');
  });

  it('should retrieve all events', async () => {
    const response = await request(app)
      .get('/api/events')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should update an event', async () => {
    // Create an event to update
    const createResponse = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Event to Update',
        startDate: new Date(),
        endDate: new Date(),
        location: 'Old Location',
      });

    const eventId = createResponse.body._id;

    const updateResponse = await request(app)
      .put(`/api/events/${eventId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Event',
        location: 'New Location',
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toHaveProperty('message', 'Event updated successfully');
  });

  it('should delete an event', async () => {
    // Create an event to delete
    const createResponse = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Event to Delete',
        startDate: new Date(),
        endDate: new Date(),
        location: 'Sample Location',
      });

    const eventId = createResponse.body._id;

    const deleteResponse = await request(app)
      .delete(`/api/events/${eventId}`)
      .set('Authorization', `Bearer ${token}`);

      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body).toHaveProperty('message', 'Event deleted successfully');
  });
});
