import { PgTransaction } from 'drizzle-orm/pg-core';
import { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js';
import { ExtractTablesWithRelations } from 'drizzle-orm';
import * as schema from './schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

export type DrizzleSchema = typeof schema;

export type DrizzleTransactionScope = PgTransaction<
  PostgresJsQueryResultHKT,
  DrizzleSchema,
  ExtractTablesWithRelations<DrizzleSchema>
>;

export type DrizzleDatabase = NodePgDatabase<DrizzleSchema>;

export const DrizzleDatabase = Symbol('DATABASE');

export type Maybe<T> = T | null | undefined;
