import type { AnnouncementDTO } from '@/types/api';
import type { AnnouncementRepository, UpdateAnnouncementInput } from '../interfaces';
import { getDb } from '@/lib/db/client';

function rowToDto(row: {
  id: number;
  msg: string;
  isShow: string;
  created_at: string | null;
  updated_at: string | null;
}): AnnouncementDTO {
  return {
    id: row.id,
    msg: row.msg,
    isShow: row.isShow,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export class DbAnnouncementRepository implements AnnouncementRepository {
  async findAll(): Promise<AnnouncementDTO[]> {
    const db = getDb();
    const rows = await db.selectFrom('announcement').selectAll().execute();
    return rows.map(rowToDto);
  }

  async update(id: number, data: UpdateAnnouncementInput): Promise<AnnouncementDTO | null> {
    const db = getDb();
    const existing = await db
      .selectFrom('announcement')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
    if (!existing) return null;

    const updateData: Record<string, unknown> = {};
    if (data.msg !== undefined) updateData.msg = data.msg;
    if (data.isShow !== undefined) updateData.isShow = data.isShow;

    if (Object.keys(updateData).length > 0) {
      await db.updateTable('announcement').set(updateData).where('id', '=', id).execute();
    }

    const updated = await db
      .selectFrom('announcement')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirstOrThrow();

    return rowToDto(updated);
  }
}
