import z from 'zod';

import { type FastifyReply, type FastifyRequest } from 'fastify';

import { RegisterUseCase } from '../use-cases/register';
import { PrismaUsersRepository } from '@/http/repositories/prisma/prisma-users-repository';
import { UserAlreadyExistsError } from '../use-cases/errors/user-already-exists';

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6),
  });

  const { email, name, password } = registerBodySchema.parse(request.body);

  try {
    const usersRepository = new PrismaUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    await registerUseCase.execute({ email, name, password });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.code(409).send({ message: error.message });
    }

    throw error;
  }

  return reply.code(201).send();
}
