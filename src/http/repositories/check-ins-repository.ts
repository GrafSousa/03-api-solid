import { type CheckIn, type Prisma } from '@prisma/client';

export interface CheckInsRepository {
  save(checkIn: CheckIn): Promise<CheckIn>;
  countByUserId(userId: string): Promise<number>;
  findById(checkInId: string): Promise<CheckIn | null>;
  findManyByUserId(userId: string, page: number): Promise<CheckIn[]>;
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>;
}
