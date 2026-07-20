import { PrismaGymsRepository } from '@/http/repositories/prisma/prisma-gyms-repository';

import { CreateGymUseCase } from '../create-gym';

export function makeCreateGymUseCase() {
  const gymsRepository = new PrismaGymsRepository();

  const getCreateGymUseCase = new CreateGymUseCase(gymsRepository);

  return { getCreateGymUseCase };
}
