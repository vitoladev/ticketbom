import 'dotenv/config';
import { Config } from 'drizzle-kit';

export default {
  schema: './apps/ticketbom-api/src/common/database/schema.ts',
  out: './apps/ticketbom-api/src/common/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'postgres',
  },
  verbose: true,
  strict: true,
} satisfies Config;
