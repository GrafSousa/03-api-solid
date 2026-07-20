import { type FastifyInstance } from 'fastify';

import { verifyJwt } from './middlewares/verify-jwt';

import { profile } from './controllers/profile.controller';
import { register } from './controllers/register.controller';
import { authenticate } from './controllers/authenticate.controller';

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register);
  app.post('/session', authenticate);

  /** Authenticated */

  app.get('/me', { onRequest: [verifyJwt] }, profile);
}
