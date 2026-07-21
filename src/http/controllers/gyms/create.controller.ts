import z from 'zod';

import { type FastifyReply, type FastifyRequest } from 'fastify';

import { makeCreateGymUseCase } from '@/http/use-cases/factories/make-create-gym-use-case';

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { title, description, latitude, longitude, phone } =
    createGymBodySchema.parse(request.body);

  const { createGymUseCase } = makeCreateGymUseCase();

  await createGymUseCase.execute({
    title,
    description,
    latitude,
    longitude,
    phone,
  });

  return reply.code(201).send();
}
