import z from 'zod';

import { type FastifyReply, type FastifyRequest } from 'fastify';

import { AuthenticateUseCase } from '../use-cases/authenticate';
import { PrismaUsersRepository } from '@/http/repositories/prisma/prisma-users-repository';
import { InvalidCredentialsError } from '../use-cases/errors/invalid-credentials';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const usersRepository = new PrismaUsersRepository();
    const authenticateUseCase = new AuthenticateUseCase(usersRepository);

    await authenticateUseCase.execute({ email, password });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.code(400).send({ message: error.message });
    }

    throw error;
  }

  return reply.code(200).send();
}
