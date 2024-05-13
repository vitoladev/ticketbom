import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

const connection = new Client({
  host: process.env.DB_HOST,
  port: 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

await connection.connect();

export const db = drizzle(connection);
