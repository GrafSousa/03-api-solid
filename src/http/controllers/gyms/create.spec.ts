import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('e2e: Create Gym', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create an gym', async () => {
    const { token } = await createAndAuthenticateUser(app);

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Gym test',
        phone: '1199999999',
        description: 'description test',
        latitude: 40.437925,
        longitude: -3.7619365,
      });

    expect(response.statusCode).toEqual(201);
  });
});
