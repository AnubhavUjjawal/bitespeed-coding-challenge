import {z} from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

const configSchema = z.object({
  PORT: z.string().default('3000'),
  DB_URL: z.string(),
  DB_LOGGING: z.boolean({coerce: true}).default(true),
});

const config = configSchema.parse(process.env);
export default config;
