import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('category')
    .ifNotExists()
    .addColumn('id', 'varchar(36)', (column) => column.notNull())
    .addColumn('study_id', 'varchar(36)', (column) => column.notNull())
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('category').ifExists().execute();
}
