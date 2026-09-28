import type { CommentDTO } from '@/types/api';
import type {
  CommentRepository,
  CommentFilters,
  CreateCommentInput,
  UpdateCommentInput,
} from '../interfaces';
import { getDb } from '@/lib/db/client';
import { withLocalMysqlRecovery } from '@/lib/db/mysql-recovery';
import type { Kysely } from 'kysely';
import type { Database } from '@/types/db';

function rowToDto(row: {
  id: number;
  category: string;
  rank_1: string;
  rank_2: string;
  year: number;
  score: number;
  isPass: string;
  out_maj: string;
  in_maj: string;
  department: string;
  comment: string;
  confirm: string;
}): CommentDTO {
  return {
    id: row.id,
    category: row.category,
    rank_1: row.rank_1,
    rank_2: row.rank_2,
    year: row.year,
    score: row.score,
    isPass: row.isPass,
    out_maj: row.out_maj,
    in_maj: row.in_maj,
    department: row.department,
    comment: row.comment,
    confirm: row.confirm,
  };
}

function withCommentDbRecovery<T>(operation: (db: Kysely<Database>) => Promise<T>): Promise<T> {
  return withLocalMysqlRecovery(() => operation(getDb()));
}

export class DbCommentRepository implements CommentRepository {
  async findAll(filters?: CommentFilters): Promise<CommentDTO[]> {
    const rows = await withCommentDbRecovery((db) => {
      let query = db.selectFrom('major').selectAll();

      if (filters?.college) {
        query = query.where('department', '=', filters.college);
      }
      if (filters?.department) {
        query = query.where('in_maj', '=', filters.department);
      }
      if (filters?.year) {
        query = query.where('year', '=', Number(filters.year));
      }
      if (filters?.category) {
        query = query.where('category', '=', filters.category);
      }
      if (filters?.confirm !== undefined) {
        query = query.where('confirm', '=', String(filters.confirm));
      }

      // Match the legacy Laravel endpoint, which returns newest comments first.
      return query.orderBy('id', 'desc').execute();
    });

    return rows.map(rowToDto);
  }

  async findById(id: number): Promise<CommentDTO | null> {
    const row = await withCommentDbRecovery((db) =>
      db.selectFrom('major').selectAll().where('id', '=', id).executeTakeFirst(),
    );

    return row ? rowToDto(row) : null;
  }

  async create(data: CreateCommentInput): Promise<CommentDTO> {
    const result = await withCommentDbRecovery((db) =>
      db
        .insertInto('major')
        .values({
          category: data.category,
          rank_1: data.rank_1,
          rank_2: data.rank_2,
          year: data.year,
          score: Number(data.score),
          isPass: data.isPass,
          out_maj: data.out_maj,
          in_maj: data.in_maj,
          department: data.department,
          comment: data.comment,
          confirm: data.confirm,
        })
        .executeTakeFirstOrThrow(),
    );

    const inserted = await withCommentDbRecovery((db) =>
      db
        .selectFrom('major')
        .selectAll()
        .where('id', '=', Number(result.insertId))
        .executeTakeFirstOrThrow(),
    );

    return rowToDto(inserted);
  }

  async update(id: number, data: UpdateCommentInput): Promise<CommentDTO | null> {
    const existing = await withCommentDbRecovery((db) =>
      db.selectFrom('major').selectAll().where('id', '=', id).executeTakeFirst(),
    );

    if (!existing) return null;

    const updateData: Record<string, unknown> = {};
    if (data.category !== undefined) updateData.category = data.category;
    if (data.rank_1 !== undefined) updateData.rank_1 = data.rank_1;
    if (data.rank_2 !== undefined) updateData.rank_2 = data.rank_2;
    if (data.year !== undefined) updateData.year = data.year;
    if (data.score !== undefined) updateData.score = Number(data.score);
    if (data.isPass !== undefined) updateData.isPass = data.isPass;
    if (data.out_maj !== undefined) updateData.out_maj = data.out_maj;
    if (data.in_maj !== undefined) updateData.in_maj = data.in_maj;
    if (data.department !== undefined) updateData.department = data.department;
    if (data.comment !== undefined) updateData.comment = data.comment;
    if (data.confirm !== undefined) updateData.confirm = data.confirm;

    if (Object.keys(updateData).length > 0) {
      await withCommentDbRecovery((db) =>
        db.updateTable('major').set(updateData).where('id', '=', id).execute(),
      );
    }

    const updated = await withCommentDbRecovery((db) =>
      db.selectFrom('major').selectAll().where('id', '=', id).executeTakeFirstOrThrow(),
    );

    return rowToDto(updated);
  }

  async delete(id: number): Promise<boolean> {
    const result = await withCommentDbRecovery((db) =>
      db.deleteFrom('major').where('id', '=', id).executeTakeFirst(),
    );

    return Number(result.numDeletedRows) > 0;
  }

  async confirm(id: number): Promise<CommentDTO | null> {
    const existing = await withCommentDbRecovery((db) =>
      db.selectFrom('major').selectAll().where('id', '=', id).executeTakeFirst(),
    );

    if (!existing) return null;

    await withCommentDbRecovery((db) =>
      db.updateTable('major').set({ confirm: 'true' }).where('id', '=', id).execute(),
    );

    const updated = await withCommentDbRecovery((db) =>
      db.selectFrom('major').selectAll().where('id', '=', id).executeTakeFirstOrThrow(),
    );

    return rowToDto(updated);
  }
}
