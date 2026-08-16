import type { CollegeDTO } from '@/types/api';
import type {
  CollegeRepository,
  CreateCollegeInput,
  UpdateCollegeInput,
} from '../interfaces';

const seedData: CollegeDTO[] = [
  { id: 1, name: '文學院' },
  { id: 2, name: '理學院' },
  { id: 3, name: '工學院' },
  { id: 4, name: '管理學院' },
  { id: 5, name: '醫學院' },
  { id: 6, name: '社會科學院' },
  { id: 7, name: '電資學院' },
  { id: 8, name: '規設院' },
  { id: 9, name: '生科院' },
  { id: 10, name: '其他' },
];

let store: CollegeDTO[] = [...seedData];
let nextId = 11;

export class MockCollegeRepository implements CollegeRepository {
  async findAll(): Promise<CollegeDTO[]> {
    return [...store];
  }

  async create(data: CreateCollegeInput): Promise<CollegeDTO> {
    const item: CollegeDTO = { id: nextId++, ...data };
    store.push(item);
    return { ...item };
  }

  async update(id: number, data: UpdateCollegeInput): Promise<CollegeDTO | null> {
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
}
