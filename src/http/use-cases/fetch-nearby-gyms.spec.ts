import { expect, describe, it, beforeEach } from 'vitest';

import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe('use-case: Fetch Nearby Gyms', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      description: null,
      title: 'Near Gym',
      phone: null,
      latitude: 40.437925,
      longitude: -3.7619365,
    });

    await gymsRepository.create({
      description: null,
      title: 'Far Gym',
      phone: null,
      latitude: 23.0075568,
      longitude: -46.8044302,
    });

    const { gyms } = await sut.execute({
      userLatitude: 40.437925,
      userLongitude: -3.7619365,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })]);
  });
});
