import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest';
import { Decimal } from '@prisma/client/runtime/library';

import { CheckInUseCase } from './check-in';
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository';
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-ins-repository';

let gymsRepository: InMemoryGymsRepository;
let checkInsRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;

describe('use-case: Check-in', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();

    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    gymsRepository.items.push({
      id: 'gym-01',
      description: '',
      title: 'Gym Test',
      phone: '',
      latitude: new Decimal(40.437925),
      longitude: new Decimal(-3.7619365),
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 40.437925,
      userLongitude: -3.7619365,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2026, 8, 17, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 40.437925,
      userLongitude: -3.7619365,
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: 40.437925,
        userLongitude: -3.7619365,
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2026, 8, 16, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 40.437925,
      userLongitude: -3.7619365,
    });

    vi.setSystemTime(new Date(2026, 8, 1, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 40.437925,
      userLongitude: -3.7619365,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      description: '',
      title: 'Gym Test',
      phone: '',
      latitude: new Decimal(40.4865033),
      longitude: new Decimal(-4.0767182),
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: 40.437925,
        userLongitude: -3.7619365,
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
