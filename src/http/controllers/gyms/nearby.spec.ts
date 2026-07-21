import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('e2e: Nearby Gyms', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app);

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: null,
        title: 'Near Gym',
        phone: null,
        latitude: 40.437925,
        longitude: -3.7619365,
      });

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: null,
        title: 'Far Gym',
        phone: null,
        latitude: 23.0075568,
        longitude: -46.8044302,
      });

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: 40.437925,
        longitude: -3.7619365,
      })
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Near Gym',
      }),
    ]);
  });
});
