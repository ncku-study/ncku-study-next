import type { UserDTO } from '@/types/api';
import type { UserRepository } from '../interfaces';
import { getDb } from '@/lib/db/client';

export class DbUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<(UserDTO & { password: string }) | null> {
    const db = getDb();
    const row = await db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();

    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      email: row.email,
      password: row.password,
    };
  }
}
