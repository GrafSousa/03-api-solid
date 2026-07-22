import { hash } from 'bcryptjs';
import request from 'supertest';
import { type FastifyInstance } from 'fastify';

import { prisma } from '@/lib/prisma';

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
) {
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  });

  const authResponse = await request(app.server).post('/session').send({
    email: 'johndoe@example.com',
    password: '123456',
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { token } = authResponse.body;

  return { token };
}
