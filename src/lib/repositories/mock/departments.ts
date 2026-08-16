import type { DepartmentDTO } from '@/types/api';
import type {
  DepartmentRepository,
  CreateDepartmentInput,
  UpdateDepartmentInput,
} from '../interfaces';

const seedData: DepartmentDTO[] = [
  { id: 1, name: '中文系', college: '文學院' },
  { id: 2, name: '外文系', college: '文學院' },
  { id: 3, name: '數學系', college: '理學院' },
  { id: 4, name: '台文系', college: '文學院' },
  { id: 5, name: '物理系', college: '理學院' },
  { id: 6, name: '化學系', college: '理學院' },
  { id: 7, name: '地科系', college: '理學院' },
  { id: 8, name: '光電系', college: '理學院' },
  { id: 9, name: '機械系', college: '工學院' },
  { id: 10, name: '化工系', college: '工學院' },
  { id: 11, name: '材料系', college: '工學院' },
  { id: 12, name: '資源系', college: '工學院' },
  { id: 13, name: '土木系', college: '工學院' },
  { id: 14, name: '水利系', college: '工學院' },
  { id: 15, name: '工科系', college: '工學院' },
  { id: 16, name: '系統系', college: '工學院' },
  { id: 17, name: '航太系', college: '工學院' },
  { id: 18, name: '環工系', college: '工學院' },
  { id: 19, name: '測量系', college: '工學院' },
  { id: 20, name: '醫工系', college: '工學院' },
  { id: 21, name: '能源學程', college: '工學院' },
  { id: 22, name: '工資系', college: '管理學院' },
  { id: 23, name: '交管系', college: '管理學院' },
  { id: 24, name: '企管系', college: '管理學院' },
  { id: 25, name: '統計系', college: '管理學院' },
  { id: 26, name: '會計系', college: '管理學院' },
  { id: 27, name: '醫學系', college: '醫學院' },
  { id: 28, name: '牙醫系', college: '醫學院' },
  { id: 29, name: '醫技系', college: '醫學院' },
  { id: 30, name: '護理系', college: '醫學院' },
  { id: 31, name: '職治系', college: '醫學院' },
  { id: 32, name: '物治系', college: '醫學院' },
  { id: 33, name: '藥學系', college: '醫學院' },
  { id: 34, name: '政治系', college: '社會科學院' },
  { id: 35, name: '經濟系', college: '社會科學院' },
  { id: 36, name: '法律系', college: '社會科學院' },
  { id: 37, name: '心理系', college: '社會科學院' },
  { id: 38, name: '電機系', college: '電資學院' },
  { id: 39, name: '資訊系', college: '電資學院' },
  { id: 40, name: '建築系', college: '規設院' },
  { id: 41, name: '都計系', college: '規設院' },
  { id: 42, name: '工設系', college: '規設院' },
  { id: 43, name: '生科系', college: '生科院' },
  { id: 44, name: '生技系', college: '生科院' },
  { id: 45, name: '不分系', college: '其他' },
  { id: 46, name: '歷史系', college: '文學院' },
  { id: 47, name: '公衛系', college: '醫學院' },
];

let store: DepartmentDTO[] = [...seedData];
let nextId = 48;

export class MockDepartmentRepository implements DepartmentRepository {
  async findAll(): Promise<DepartmentDTO[]> {
    return [...store];
  }

  async create(data: CreateDepartmentInput): Promise<DepartmentDTO> {
    const item: DepartmentDTO = { id: nextId++, ...data };
    store.push(item);
    return { ...item };
  }

  async update(id: number, data: UpdateDepartmentInput): Promise<DepartmentDTO | null> {
    const idx = store.findIndex((d) => d.id === id);
    if (idx === -1) return null;
    store[idx] = { ...store[idx], ...data };
    return { ...store[idx] };
  }

  async delete(id: number): Promise<boolean> {
    const idx = store.findIndex((d) => d.id === id);
    if (idx === -1) return false;
    store.splice(idx, 1);
    return true;
  }
}
