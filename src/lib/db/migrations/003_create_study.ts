import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('study')
    .ifNotExists()
    .addColumn('id', 'varchar(36)', (column) => column.primaryKey().notNull())
    .addColumn('title', 'text', (column) => column.notNull())
    .addColumn('content', 'text', (column) => column.notNull())
    .addColumn('year', 'integer', (column) => column.notNull())
    .addColumn('major', 'text', (column) => column.notNull())
    .addColumn('category', 'text', (column) => column.notNull())
    .addColumn('statistic', 'text', (column) => column.notNull())
    .addColumn('otherStat', 'text', (column) => column.notNull())
    .addColumn('created_at', 'timestamp')
    .addColumn('updated_at', 'timestamp')
    .addColumn('confirm', 'varchar(10)', (column) => column.notNull())
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('study').ifExists().execute();
}
