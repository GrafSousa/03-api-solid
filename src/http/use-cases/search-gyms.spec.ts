import { expect, describe, it, beforeEach } from 'vitest';

import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository';
import { SearchGymUseCase } from './search-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymUseCase;

describe('use-case: Search Gyms', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymUseCase(gymsRepository);
  });

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      description: null,
      title: 'Gym Test',
      phone: null,
      latitude: 40.437925,
      longitude: -3.7619365,
    });

    await gymsRepository.create({
      description: null,
      title: 'Javascript Gym',
      phone: null,
      latitude: 40.437925,
      longitude: -3.7619365,
    });

    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Javascript Gym' }),
    ]);
  });

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 0; i < 22; i++) {
      await gymsRepository.create({
        description: null,
        title: `Gym Test ${i}`,
        phone: null,
        latitude: 40.437925,
        longitude: -3.7619365,
      });
    }

    const { gyms } = await sut.execute({
      query: 'Gym',
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Gym Test 20' }),
      expect.objectContaining({ title: 'Gym Test 21' }),
    ]);
  });
});
