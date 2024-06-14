import { DrizzleTransactionScope, Maybe } from '../types';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../schema';
import { Tables } from '../schema';
import {
  PgInsertValue,
  PgTable,
  PgTableWithColumns,
  SelectedFields,
  TableConfig,
} from 'drizzle-orm/pg-core';
import { eq, sql } from 'drizzle-orm';

interface PaginationOutput<T> {
  data: T[];
  totalRecords: number;
  totalPages: number;
}

export interface IRepository<
  Config extends TableConfig,
  TInput = PgInsertValue<PgTable<Config>>,
  TOutput = PgTableWithColumns<Config>['$inferSelect']
> {
  findWithPagination(
    fields: SelectedFields,
    page: number,
    pageSize: number
  ): Promise<PaginationOutput<TOutput>>;

  findOne(id: string): Promise<Maybe<TOutput>>;

  create(entity: TInput): Promise<TOutput>;

  update(id: string, entity: TOutput): Promise<TOutput>;

  delete(id: string): Promise<void>;
}

export class BaseRepository<
  Config extends TableConfig,
  TInput = PgInsertValue<PgTable<Config>>,
  TOutput = PgTableWithColumns<Config>['$inferSelect']
> implements IRepository<Config, TInput, TOutput>
{
  private table = schema[this.tableName];

  constructor(
    protected db: NodePgDatabase<typeof schema>,
    private tableName: Tables
  ) {}

  async findWithPagination(
    fields: SelectedFields,
    page: number,
    pageSize: number
  ): Promise<PaginationOutput<TOutput>> {
    const offset = (page - 1) * pageSize;

    const [data, [{ count }]] = await Promise.all([
      this.db
        .select(fields)
        .from(this.table)
        .limit(pageSize)
        .offset(offset)
        .execute(),
      this.db
        .select({ count: sql<number>`CAST(COUNT(*) AS INTEGER)` })
        .from(this.table)
        .execute(),
    ]);

    const totalPages = Math.ceil(count / pageSize);

    return {
      data: data as TOutput[],
      totalRecords: count,
      totalPages,
    };
  }

  async findOne(
    id: string,
    transactionScope?: DrizzleTransactionScope
  ): Promise<Maybe<TOutput>> {
    const dbScope = transactionScope || this.db;

    const result = (await dbScope
      .select()
      .from(this.table)
      .where(eq(this.table.id, id))
      .execute()
      .then((result) => result)) as TOutput | undefined;
    return result;
  }

  async create(
    entity: TInput,
    transactionScope?: DrizzleTransactionScope
  ): Promise<TOutput> {
    const dbScope = transactionScope || this.db;

    return dbScope
      .insert(this.table)
      .values(entity)
      .returning()
      .execute()
      .then((rows) => rows[0]) as Promise<TOutput>;
  }

  async update(
    id: string,
    entity: TOutput,
    transactionScope?: DrizzleTransactionScope
  ): Promise<TOutput> {
    const dbScope = transactionScope || this.db;

    return dbScope
      .update(this.table)
      .set(entity)
      .where(eq(this.table, id))
      .returning()
      .then((result) => result[0]) as Promise<TOutput>;
  }

  async delete(
    id: string,
    transactionScope?: DrizzleTransactionScope
  ): Promise<void> {
    const dbScope = transactionScope || this.db;

    await dbScope.delete(this.table).where(eq(this.table.id, id)).execute();
  }

  async withTransaction<T>(
    callback: (tx: DrizzleTransactionScope) => Promise<T>
  ): Promise<T> {
    return this.db.transaction(async (tx) => {
      const result = await callback(tx);
      return result;
    });
  }
}
