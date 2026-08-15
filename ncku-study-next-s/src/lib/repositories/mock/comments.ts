import type { CommentDTO } from '@/types/api';
import type {
  CommentRepository,
  CommentFilters,
  CreateCommentInput,
  UpdateCommentInput,
} from '../interfaces';
import seedArray from './comment-seed';

// Cast the seed data — the source file uses plain JS objects matching CommentDTO shape
const seedData: CommentDTO[] = seedArray as CommentDTO[];

const store: CommentDTO[] = [...seedData];
let nextId: number = Math.max(...seedData.map((c) => c.id)) + 1;

export class MockCommentRepository implements CommentRepository {
  async findAll(filters?: CommentFilters): Promise<CommentDTO[]> {
    let result = [...store];
    if (filters?.college) {
      result = result.filter((c) => c.department === filters.college);
    }
    if (filters?.department) {
      result = result.filter((c) => c.in_maj === filters.department);
    }
    if (filters?.year) {
      result = result.filter((c) => String(c.year) === String(filters.year));
    }
    if (filters?.category) {
      result = result.filter((c) => c.category === filters.category);
    }
    if (filters?.confirm !== undefined) {
      const confirmStr = String(filters.confirm);
      result = result.filter((c) => c.confirm === confirmStr);
    }
    return result;
  }

  async findById(id: number): Promise<CommentDTO | null> {
    return store.find((c) => c.id === id) ?? null;
  }

  async create(data: CreateCommentInput): Promise<CommentDTO> {
    const item: CommentDTO = { id: nextId++, ...data };
    store.push(item);
    return { ...item };
  }

  async update(id: number, data: UpdateCommentInput): Promise<CommentDTO | null> {
    const idx = store.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    store[idx] = { ...store[idx], ...data };
    return { ...store[idx] };
  }

  async delete(id: number): Promise<boolean> {
    const idx = store.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    store.splice(idx, 1);
    return true;
  }

  async confirm(id: number): Promise<CommentDTO | null> {
    const idx = store.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    store[idx] = { ...store[idx], confirm: 'true' };
    return { ...store[idx] };
  }
}
