import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Kysely } from 'kysely';
import { FileMigrationProvider, Migrator } from 'kysely/migration';
import type { Database } from '@/types/db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const migrationsPath = path.join(__dirname, 'migrations');

export function createMigrator(db: Kysely<Database>): Migrator {
  return new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: migrationsPath,
    }),
  });
}
