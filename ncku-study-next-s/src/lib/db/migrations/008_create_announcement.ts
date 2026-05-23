import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('announcement')
    .ifNotExists()
    .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement().notNull())
    .addColumn('msg', 'varchar(256)', (column) => column.notNull())
    .addColumn('isShow', 'varchar(10)', (column) => column.notNull())
    .addColumn('created_at', 'timestamp')
    .addColumn('updated_at', 'timestamp')
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('announcement').ifExists().execute();
}
