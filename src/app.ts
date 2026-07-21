import fastify from 'fastify';
import { z, ZodError } from 'zod';
import fastifyJwt from '@fastify/jwt';

import { env } from './env';
import { userRoutes } from './http/controllers/users/routes';
import { gymsRoutes } from './http/controllers/gyms/routes';

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(userRoutes);
app.register(gymsRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: z.treeifyError(error) });
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  }

  return reply.status(500).send({ message: 'Internal server error.' });
});
