import type { Kysely } from 'kysely';

// UUID-named statistic tables are created dynamically at runtime, not through migrations.
export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('statistic_manage')
    .ifNotExists()
    .addColumn('id', 'varchar(36)', (column) => column.primaryKey().notNull())
    .addColumn('name', 'text', (column) => column.notNull())
    .addColumn('dataType', 'varchar(10)', (column) => column.notNull())
    .addColumn('max', 'double precision', (column) => column.notNull().defaultTo(0))
    .addColumn('min', 'double precision', (column) => column.notNull().defaultTo(0))
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('statistic_manage').ifExists().execute();
}
