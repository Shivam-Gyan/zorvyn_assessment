import request from 'supertest';

process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/test';
process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'test-secret';

import app from '../src/app';

describe('Health endpoint', () => {
  it('should return service health response', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Service healthy');
    expect(response.body.data).toHaveProperty('timestamp');
  });
});
