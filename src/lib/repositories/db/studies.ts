import type { StudyDTO, CategoryDTO, OtherStatisticDTO } from '@/types/api';
import type {
  StudyRepository,
  StudyFilters,
  CreateStudyInput,
  UpdateStudyInput,
} from '../interfaces';
import { getDb } from '@/lib/db/client';
import { randomUUID } from 'crypto';

function rowToDto(
  row: {
    id: string;
    title: string;
    content: string;
    year: number;
    major: string;
    category: string;
    statistic: string;
    otherStat: string;
    created_at: string | null;
    updated_at: string | null;
    confirm: string;
  }
): StudyDTO {
  let category: CategoryDTO[] = [];
  let statistic: Array<{ id?: string; name?: string; value?: string | number }> = [];
  let otherStat: OtherStatisticDTO[] = [];

  try { category = JSON.parse(row.category) as CategoryDTO[]; } catch { category = []; }
  try { statistic = JSON.parse(row.statistic) as Array<{ id?: string; name?: string; value?: string | number }>; } catch { statistic = []; }
  try { otherStat = JSON.parse(row.otherStat) as OtherStatisticDTO[]; } catch { otherStat = []; }

  return {
    id: row.id,
    title: row.title,
    content: row.content,
    year: row.year,
    major: row.major,
    timestamp: row.created_at ?? '',
    confirm: row.confirm,
    category,
    statistic,
    otherStat,
  };
}

export class DbStudyRepository implements StudyRepository {
  async findAll(filters?: StudyFilters): Promise<StudyDTO[]> {
    const db = getDb();
    const rows = await db
      .selectFrom('study')
      .selectAll()
      .orderBy('created_at', 'desc')
      .execute();
    let result = rows.map(rowToDto);

    if (filters?.category) {
      result = result.filter((s) =>
        s.category.some((c) => c.id === filters.category || c.name === filters.category)
      );
    }
    if (filters?.year) {
      result = result.filter((s) => String(s.year) === String(filters.year));
    }
    if (filters?.confirm !== undefined) {
      const confirmStr = String(filters.confirm);
      result = result.filter((s) => s.confirm === confirmStr);
    }

    return result;
  }

  async findById(id: string): Promise<StudyDTO | null> {
    const db = getDb();
    const row = await db
      .selectFrom('study')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
    return row ? rowToDto(row) : null;
  }

  async create(data: CreateStudyInput): Promise<StudyDTO> {
    const db = getDb();
    const id = randomUUID();
    await db
      .insertInto('study')
      .values({
        id,
        title: data.title,
        content: data.content,
        year: data.year,
        major: data.major,
        category: JSON.stringify(data.category),
        statistic: JSON.stringify(data.statistic),
        otherStat: JSON.stringify(data.otherStat),
        confirm: data.confirm,
      })
      .execute();

    const inserted = await db
      .selectFrom('study')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirstOrThrow();

    return rowToDto(inserted);
  }

  async update(id: string, data: UpdateStudyInput): Promise<StudyDTO | null> {
    const db = getDb();
    const existing = await db
      .selectFrom('study')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
    if (!existing) return null;

    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.year !== undefined) updateData.year = data.year;
    if (data.major !== undefined) updateData.major = data.major;
    if (data.category !== undefined) updateData.category = JSON.stringify(data.category);
    if (data.statistic !== undefined) updateData.statistic = JSON.stringify(data.statistic);
    if (data.otherStat !== undefined) updateData.otherStat = JSON.stringify(data.otherStat);
    if (data.confirm !== undefined) updateData.confirm = data.confirm;

    if (Object.keys(updateData).length > 0) {
      await db.updateTable('study').set(updateData).where('id', '=', id).execute();
    }

    const updated = await db
      .selectFrom('study')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirstOrThrow();

    return rowToDto(updated);
  }

  async delete(id: string): Promise<boolean> {
    const db = getDb();
    const result = await db.deleteFrom('study').where('id', '=', id).executeTakeFirst();
    return Number(result.numDeletedRows) > 0;
  }

  async confirm(id: string): Promise<StudyDTO | null> {
    const db = getDb();
    const existing = await db
      .selectFrom('study')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
    if (!existing) return null;

    await db.updateTable('study').set({ confirm: 'true' }).where('id', '=', id).execute();

    const updated = await db
      .selectFrom('study')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirstOrThrow();

    return rowToDto(updated);
  }
}
