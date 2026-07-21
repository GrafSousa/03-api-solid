import z from 'zod';

import { type FastifyReply, type FastifyRequest } from 'fastify';

import { makeFetchUserCheckInsHistoryUseCase } from '@/http/use-cases/factories/make-fetch-user-check-ins-history-use-case';

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const historyQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = historyQuerySchema.parse(request.query);

  const { fetchUserCheckInsHistoryUseCase } =
    makeFetchUserCheckInsHistoryUseCase();

  const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
    page,
    userId: request.user.sub,
  });

  return reply.code(201).send({ checkIns });
}
