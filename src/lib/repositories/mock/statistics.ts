import type { StatisticManageDTO } from '@/types/api';
import type {
  StatisticRepository,
  CreateStatisticInput,
  UpdateStatisticInput,
} from '../interfaces';
import { randomUUID } from 'crypto';

const seedData: StatisticManageDTO[] = [
  { id: '1c6a7add-0082-4035-b6d9-40054da271ae', name: 'IELTS', dataType: 'float', max: 9, min: 0 },
  { id: '396c9114-c456-4103-a9c2-37d42c37e676', name: 'TOEIC', dataType: 'int', max: 990, min: 0 },
  { id: '57099e13-2d69-4fa3-885d-e301e9b599fe', name: 'JLPT', dataType: 'string', max: 0, min: 0 },
  { id: 'a7e115c9-39e4-4016-8d07-ec66b6e57570', name: '學年成績', dataType: 'float', max: 100, min: 0 },
  { id: 'b5d6c55b-a2f5-4dcd-9b10-86414d7aa7de', name: 'GPA(4.0)', dataType: 'float', max: 4, min: 0 },
  { id: 'd366a894-d35d-4d8e-a7b8-67386f0e43fa', name: 'TOFEL iBT', dataType: 'int', max: 990, min: 0 },
  { id: 'ef4f8898-55a3-41e1-909a-094187b9daaf', name: 'GPA(4.3)', dataType: 'float', max: 4.3, min: 0 },
];

let store: StatisticManageDTO[] = [...seedData];

export class MockStatisticRepository implements StatisticRepository {
  async findAll(): Promise<StatisticManageDTO[]> {
    return [...store];
  }

  async create(data: CreateStatisticInput): Promise<StatisticManageDTO> {
    const item: StatisticManageDTO = { id: randomUUID(), ...data };
    store.push(item);
    return { ...item };
  }

  async update(id: string, data: UpdateStatisticInput): Promise<StatisticManageDTO | null> {
    const idx = store.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    store[idx] = { ...store[idx], ...data };
    return { ...store[idx] };
  }

  async delete(id: string): Promise<boolean> {
    const idx = store.findIndex((s) => s.id === id);
    if (idx === -1) return false;
    store.splice(idx, 1);
    return true;
  }
}
