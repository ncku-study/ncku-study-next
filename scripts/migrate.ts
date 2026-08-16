import { Kysely, MysqlDialect } from 'kysely';
import mysql from 'mysql2';
import { createMigrator } from '../src/lib/db/migrator';
import type { Database } from '../src/types/db';

async function main() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required to run migrations');
  }

  const db = new Kysely<Database>({
    dialect: new MysqlDialect({
      pool: mysql.createPool(databaseUrl),
    }),
  });

  try {
    const migrator = createMigrator(db);
    const result = await migrator.migrateToLatest();

    result.results?.forEach((migration: { status: string; migrationName: string }) => {
      console.log(`${migration.status}: ${migration.migrationName}`);
    });

    if (result.error) {
      console.error(result.error);
      process.exitCode = 1;
    }
  } finally {
    await db.destroy();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
