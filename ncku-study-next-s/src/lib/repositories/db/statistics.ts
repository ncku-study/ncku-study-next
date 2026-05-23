import type { StatisticManageDTO } from '@/types/api';
import type {
  StatisticRepository,
  CreateStatisticInput,
  UpdateStatisticInput,
} from '../interfaces';
import { getDb } from '@/lib/db/client';
import { sql } from 'kysely';
import { randomUUID } from 'crypto';

function rowToDto(row: {
  id: string;
  name: string;
  dataType: string;
  max: number;
  min: number;
}): StatisticManageDTO {
  return {
    id: row.id,
    name: row.name,
    dataType: row.dataType,
    max: row.max,
    min: row.min,
  };
}

export class DbStatisticRepository implements StatisticRepository {
  async findAll(): Promise<StatisticManageDTO[]> {
    const db = getDb();
    const rows = await db.selectFrom('statistic_manage').selectAll().execute();
    return rows.map(rowToDto);
  }

  async create(data: CreateStatisticInput): Promise<StatisticManageDTO> {
    const db = getDb();
    const uuid = randomUUID();

    await db
      .insertInto('statistic_manage')
      .values({
        id: uuid,
        name: data.name,
        dataType: data.dataType,
        max: data.max,
        min: data.min,
      })
      .execute();

    await sql`CREATE TABLE ${sql.table(uuid)} (study_uuid VARCHAR(36) NOT NULL, value TEXT)`.execute(db);

    const inserted = await db
      .selectFrom('statistic_manage')
      .selectAll()
      .where('id', '=', uuid)
      .executeTakeFirstOrThrow();

    return rowToDto(inserted);
  }

  async update(id: string, data: UpdateStatisticInput): Promise<StatisticManageDTO | null> {
    const db = getDb();
    const existing = await db
      .selectFrom('statistic_manage')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
    if (!existing) return null;

    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.dataType !== undefined) updateData.dataType = data.dataType;
    if (data.max !== undefined) updateData.max = data.max;
    if (data.min !== undefined) updateData.min = data.min;

    if (Object.keys(updateData).length > 0) {
      await db
        .updateTable('statistic_manage')
        .set(updateData)
        .where('id', '=', id)
        .execute();
    }

    const updated = await db
      .selectFrom('statistic_manage')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirstOrThrow();

    return rowToDto(updated);
  }

  async delete(id: string): Promise<boolean> {
    const db = getDb();
    await sql`DROP TABLE IF EXISTS ${sql.table(id)}`.execute(db);
    const result = await db
      .deleteFrom('statistic_manage')
      .where('id', '=', id)
      .executeTakeFirst();
    return Number(result.numDeletedRows) > 0;
  }
}
