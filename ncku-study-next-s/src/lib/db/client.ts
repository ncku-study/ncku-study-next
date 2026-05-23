import { Kysely, MysqlDialect } from 'kysely';
import { createPool } from 'mysql2';
import type { Database } from '@/types/db';

let db: Kysely<Database> | undefined;

export function getDb(): Kysely<Database> {
  if (!db) {
    db = new Kysely<Database>({
      dialect: new MysqlDialect({
        pool: createPool(process.env.DATABASE_URL!),
      }),
    });
  }
  return db;
}
