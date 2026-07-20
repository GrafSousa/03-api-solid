import 'dotenv/config';

import { type Environment } from 'vitest/environments';
import { randomUUID } from 'node:crypto';
import { execSync } from 'node:child_process';

import { env } from '@/env';
import { prisma } from '@/lib/prisma';

function generateDatabaseUrl(schema: string) {
  if (!env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL env variable');
  }

  const url = new URL(env.DATABASE_URL);
  url.searchParams.set('schema', schema);

  return url.toString();
}

export default <Environment>{
  name: 'prisma',
  viteEnvironment: 'ssr',
  async setup() {
    const schema = randomUUID();
    const databaseUrl = generateDatabaseUrl(schema);

    console.log(databaseUrl);

    env.DATABASE_URL = databaseUrl;

    execSync('npx prisma db push');

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        );

        await prisma.$disconnect();
      },
    };
  },
};
