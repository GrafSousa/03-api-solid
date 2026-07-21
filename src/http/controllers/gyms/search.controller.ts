import z from 'zod';

import { type FastifyReply, type FastifyRequest } from 'fastify';
import { makeSearchGymsUseCase } from '@/http/use-cases/factories/make-search-gyms-use-case';

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchGymsQuerySchema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1),
  });

  const { page, q } = searchGymsQuerySchema.parse(request.query);

  const { searchGymsUseCase } = makeSearchGymsUseCase();

  const { gyms } = await searchGymsUseCase.execute({
    query: q,
    page,
  });

  return reply.code(200).send({ gyms });
}
