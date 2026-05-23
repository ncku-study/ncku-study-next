import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('college')
    .ifNotExists()
    .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement().notNull())
    .addColumn('name', 'text', (column) => column.notNull())
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('college').ifExists().execute();
}
