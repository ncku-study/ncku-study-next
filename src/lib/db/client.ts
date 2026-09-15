import { Kysely, MysqlDialect } from 'kysely';
import { createPool, type PoolOptions } from 'mysql2';
import type { Database } from '@/types/db';

let db: Kysely<Database> | undefined;

function getConnectionConfig(): string | PoolOptions {
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl) return databaseUrl;

  const { DATABASE_HOST, DATABASE_PORT, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME } = process.env;

  if (!DATABASE_HOST || !DATABASE_USER || !DATABASE_NAME) {
    throw new Error(
      'Database configuration is required. Set DATABASE_URL or DATABASE_HOST, DATABASE_USER, and DATABASE_NAME.',
    );
  }

  const port = DATABASE_PORT ? Number(DATABASE_PORT) : undefined;
  if (port !== undefined && (!Number.isInteger(port) || port < 1 || port > 65535)) {
    throw new Error('DATABASE_PORT must be an integer between 1 and 65535.');
  }

  return {
    host: DATABASE_HOST,
    port,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
  };
}

export function getDb(): Kysely<Database> {
  if (!db) {
    const connectionConfig = getConnectionConfig();
    db = new Kysely<Database>({
      dialect: new MysqlDialect({
        pool:
          typeof connectionConfig === 'string'
            ? createPool(connectionConfig)
            : createPool(connectionConfig),
      }),
    });
  }
  return db;
}

export async function resetDbConnection(): Promise<void> {
  const currentDb = db;
  db = undefined;

  if (currentDb) {
    await currentDb.destroy();
  }
}
