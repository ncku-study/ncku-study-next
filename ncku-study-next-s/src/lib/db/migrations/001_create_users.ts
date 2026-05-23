import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('users')
    .ifNotExists()
    .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement().notNull())
    .addColumn('name', 'varchar(255)', (column) => column.notNull())
    .addColumn('email', 'varchar(255)', (column) => column.notNull().unique())
    .addColumn('password', 'varchar(255)', (column) => column.notNull())
    .addColumn('remember_token', 'varchar(255)')
    .addColumn('created_at', 'timestamp')
    .addColumn('updated_at', 'timestamp')
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('users').ifExists().execute();
}
