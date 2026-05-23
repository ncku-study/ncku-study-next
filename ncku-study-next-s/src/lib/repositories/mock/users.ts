import type { UserDTO } from '@/types/api';
import type { UserRepository } from '../interfaces';

type UserWithPassword = UserDTO & { password: string };

const store: UserWithPassword[] = [
  {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    password: 'password',
  },
];

export class MockUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<UserWithPassword | null> {
    return store.find((u) => u.email === email) ?? null;
  }
}
