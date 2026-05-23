import type { DepartmentDTO } from '@/types/api';
import type {
  DepartmentRepository,
  CreateDepartmentInput,
  UpdateDepartmentInput,
} from '../interfaces';
import { getDb } from '@/lib/db/client';

function rowToDto(row: { id: number; name: string; college: string }): DepartmentDTO {
  return { id: row.id, name: row.name, college: row.college };
}

export class DbDepartmentRepository implements DepartmentRepository {
  async findAll(): Promise<DepartmentDTO[]> {
    const db = getDb();
    const rows = await db.selectFrom('department').selectAll().execute();
    return rows.map(rowToDto);
  }

  async create(data: CreateDepartmentInput): Promise<DepartmentDTO> {
    const db = getDb();
    const result = await db
      .insertInto('department')
      .values({ name: data.name, college: data.college })
      .executeTakeFirstOrThrow();

    const inserted = await db
      .selectFrom('department')
      .selectAll()
      .where('id', '=', Number(result.insertId))
      .executeTakeFirstOrThrow();

    return rowToDto(inserted);
  }

  async update(id: number, data: UpdateDepartmentInput): Promise<DepartmentDTO | null> {
    const db = getDb();
    const existing = await db
      .selectFrom('department')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
    if (!existing) return null;

    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.college !== undefined) updateData.college = data.college;

    if (Object.keys(updateData).length > 0) {
      await db.updateTable('department').set(updateData).where('id', '=', id).execute();
    }

    const updated = await db
      .selectFrom('department')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirstOrThrow();

    return rowToDto(updated);
  }

  async delete(id: number): Promise<boolean> {
    const db = getDb();
    const result = await db.deleteFrom('department').where('id', '=', id).executeTakeFirst();
    return Number(result.numDeletedRows) > 0;
  }
}
