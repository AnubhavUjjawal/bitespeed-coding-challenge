import {z} from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

const configSchema = z.object({
  PORT: z.string().default('3000'),
  // DB_HOST: z.string(),
  // DB_PORT: z.number({coerce: true}),
  // DB_USERNAME: z.string(),
  // DB_PASSWORD: z.string(),
  // DB_DATABASE: z.string(),
  // DB_LOGGING: z.boolean({coerce: true}).default(true),
});

const config = configSchema.parse(process.env);
export default config;
