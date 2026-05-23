import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('department')
    .ifNotExists()
    .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement().notNull())
    .addColumn('name', 'text', (column) => column.notNull())
    .addColumn('college', 'text', (column) => column.notNull())
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('department').ifExists().execute();
}
