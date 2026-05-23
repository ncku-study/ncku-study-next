import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('major')
    .ifNotExists()
    .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement().notNull())
    .addColumn('category', 'varchar(256)', (column) => column.notNull())
    .addColumn('rank_1', 'text', (column) => column.notNull())
    .addColumn('rank_2', 'text', (column) => column.notNull())
    .addColumn('year', 'integer', (column) => column.notNull())
    .addColumn('score', 'double precision', (column) => column.notNull())
    .addColumn('isPass', 'varchar(10)', (column) => column.notNull())
    .addColumn('out_maj', 'text', (column) => column.notNull())
    .addColumn('in_maj', 'text', (column) => column.notNull())
    .addColumn('department', 'text', (column) => column.notNull())
    .addColumn('comment', 'text', (column) => column.notNull())
    .addColumn('confirm', 'varchar(7)', (column) => column.notNull())
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('major').ifExists().execute();
}
