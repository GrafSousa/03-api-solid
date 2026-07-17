import { expect, describe, it, beforeEach } from 'vitest';

import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository';
import { CreateGymUseCase } from './create-gym';

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe('use-case: Create Gym', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it('should be able to register', async () => {
    const { gym } = await sut.execute({
      description: null,
      title: 'Gym Test',
      phone: null,
      latitude: 40.437925,
      longitude: -3.7619365,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
