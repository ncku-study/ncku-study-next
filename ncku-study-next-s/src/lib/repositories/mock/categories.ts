import type { CategoryDTO } from '@/types/api';
import type {
  CategoryRepository,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../interfaces';
import { randomUUID } from 'crypto';

const seedData: CategoryDTO[] = [
  { id: '6e67d0b8-86be-4a82-b3e2-c18806afcdaf', name: '獎學金' },
  { id: 'b1ab7e32-b34f-4a36-8da8-7b00521747a2', name: '實習' },
  { id: 'beae92ab-9cbf-4848-9d27-b2b107ab6e50', name: '學程' },
  { id: 'c6276e00-df74-4050-85b7-d026ecfbfd34', name: '海外交換' },
  { id: 'e207cd12-60d2-4bb5-a8d4-4c44b364df29', name: '學校行政' },
  { id: 'f8383414-e780-4e7b-b84f-cd839e3ea919', name: '轉輔雙主' },
];

let store: CategoryDTO[] = [...seedData];

export class MockCategoryRepository implements CategoryRepository {
  async findAll(): Promise<CategoryDTO[]> {
    return [...store];
  }

  async create(data: CreateCategoryInput): Promise<CategoryDTO> {
    const item: CategoryDTO = { id: randomUUID(), ...data };
    store.push(item);
    return { ...item };
  }

  async update(id: string, data: UpdateCategoryInput): Promise<CategoryDTO | null> {
    const idx = store.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    store[idx] = { ...store[idx], ...data };
    return { ...store[idx] };
  }

  async delete(id: string): Promise<boolean> {
    const idx = store.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    store.splice(idx, 1);
    return true;
  }
}
