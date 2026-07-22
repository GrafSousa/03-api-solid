import { type FastifyInstance } from 'fastify';

import { verifyJwt } from '@/http/middlewares/verify-jwt';

import { refresh } from './refresh.controller';
import { profile } from './profile.controller';
import { register } from './register.controller';
import { authenticate } from './authenticate.controller';

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', register);
  app.post('/session', authenticate);

  app.patch('/token/refresh', refresh);

  /** Authenticated */

  app.get('/me', { onRequest: [verifyJwt] }, profile);
}
