import { sql } from 'drizzle-orm';
import { DrizzleDatabase } from './types';

export const pingDrizzleDb = async (db: DrizzleDatabase) => {
  const beforeQuery = Date.now();
  await db.execute(sql`select 1`);
  const afterQuery = Date.now();
  const latency = afterQuery - beforeQuery;

  return {
    status: 'ok',
    latency,
  };
};
