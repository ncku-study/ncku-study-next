import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('category_manage')
    .ifNotExists()
    .addColumn('id', 'varchar(36)', (column) => column.primaryKey().notNull())
    .addColumn('name', 'varchar(20)', (column) => column.notNull())
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('category_manage').ifExists().execute();
}
