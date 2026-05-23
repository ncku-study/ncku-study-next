import type { CategoryDTO } from '@/types/api';
import type {
  CategoryRepository,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../interfaces';
import { getDb } from '@/lib/db/client';
import { randomUUID } from 'crypto';

function rowToDto(row: { id: string; name: string }): CategoryDTO {
  return { id: row.id, name: row.name };
}

export class DbCategoryRepository implements CategoryRepository {
  async findAll(): Promise<CategoryDTO[]> {
    const db = getDb();
    const rows = await db.selectFrom('category_manage').selectAll().execute();
    return rows.map(rowToDto);
  }

  async create(data: CreateCategoryInput): Promise<CategoryDTO> {
    const db = getDb();
    const id = randomUUID();
    await db
      .insertInto('category_manage')
      .values({ id, name: data.name })
      .execute();

    const inserted = await db
      .selectFrom('category_manage')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirstOrThrow();

    return rowToDto(inserted);
  }

  async update(id: string, data: UpdateCategoryInput): Promise<CategoryDTO | null> {
    const db = getDb();
    const existing = await db
      .selectFrom('category_manage')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
    if (!existing) return null;

    if (data.name !== undefined) {
      await db
        .updateTable('category_manage')
        .set({ name: data.name })
        .where('id', '=', id)
        .execute();
    }

    const updated = await db
      .selectFrom('category_manage')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirstOrThrow();

    return rowToDto(updated);
  }

  async delete(id: string): Promise<boolean> {
    const db = getDb();
    const result = await db
      .deleteFrom('category_manage')
      .where('id', '=', id)
      .executeTakeFirst();
    return Number(result.numDeletedRows) > 0;
  }
}
