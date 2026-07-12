import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  const tree = z.treeifyError(_env.error);

  console.error('❌ Invalid environment variables', _env?.error.message);

  throw new Error(
    `⚠️ Invalid environment variables! \n ${JSON.stringify(tree, null, 2)}`,
  );
}

export const env = _env.data;
