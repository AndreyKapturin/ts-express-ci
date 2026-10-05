import request from 'supertest';
import { createApp } from './app';

describe('GET /ping', () => {
  it('returns { status: "pong" }', async () => {
    const app = createApp();
    const res = await request(app).get('/ping');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'pong' });
  });
});
