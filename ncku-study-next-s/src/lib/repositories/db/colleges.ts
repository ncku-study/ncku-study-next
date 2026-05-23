import type { CollegeDTO } from '@/types/api';
import type {
  CollegeRepository,
  CreateCollegeInput,
  UpdateCollegeInput,
} from '../interfaces';
import { getDb } from '@/lib/db/client';

function rowToDto(row: { id: number; name: string }): CollegeDTO {
  return { id: row.id, name: row.name };
}

export class DbCollegeRepository implements CollegeRepository {
  async findAll(): Promise<CollegeDTO[]> {
    const db = getDb();
    const rows = await db.selectFrom('college').selectAll().execute();
    return rows.map(rowToDto);
  }

  async create(data: CreateCollegeInput): Promise<CollegeDTO> {
    const db = getDb();
    const result = await db
      .insertInto('college')
      .values({ name: data.name })
      .executeTakeFirstOrThrow();

    const inserted = await db
      .selectFrom('college')
      .selectAll()
      .where('id', '=', Number(result.insertId))
      .executeTakeFirstOrThrow();

    return rowToDto(inserted);
  }

  async update(id: number, data: UpdateCollegeInput): Promise<CollegeDTO | null> {
    const db = getDb();
    const existing = await db
      .selectFrom('college')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
    if (!existing) return null;

    if (data.name !== undefined) {
      await db.updateTable('college').set({ name: data.name }).where('id', '=', id).execute();
    }

    const updated = await db
      .selectFrom('college')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirstOrThrow();

    return rowToDto(updated);
  }

  async delete(id: number): Promise<boolean> {
    const db = getDb();
    const result = await db.deleteFrom('college').where('id', '=', id).executeTakeFirst();
    return Number(result.numDeletedRows) > 0;
  }
}
