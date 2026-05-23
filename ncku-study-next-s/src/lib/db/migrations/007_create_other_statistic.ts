import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('other_statistic')
    .ifNotExists()
    .addColumn('id', 'varchar(36)', (column) => column.primaryKey().notNull())
    .addColumn('name', 'varchar(20)', (column) => column.notNull())
    .addColumn('value', 'varchar(20)', (column) => column.notNull())
    .addColumn('study_id', 'varchar(36)', (column) => column.notNull())
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('other_statistic').ifExists().execute();
}
