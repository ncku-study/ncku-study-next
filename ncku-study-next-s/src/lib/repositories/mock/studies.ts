import type { StudyDTO } from '@/types/api';
import type {
  StudyRepository,
  StudyFilters,
  CreateStudyInput,
  UpdateStudyInput,
} from '../interfaces';
import { randomUUID } from 'crypto';

const seedData: StudyDTO[] = [
  {
    id: 'c15a6ba7-631e-4268-bf94-7fb2877bd700',
    title: '日本千葉大學校級交換學生',
    content:
      '前往日本千葉大學參與為期4個月的校級交換學生，受到新冠肺炎疫情的影響，改為線上授課的模式，且無法實地至日本參與計畫。但幸虧網路通訊的發達，不論是各式各樣的課程、交流活動，都能順利進行。千葉大學提供交換學生非常多樣的資源，學伴制度、會話練習等等，讓我就算人在台灣，也能夠有豐富的機會練習日文，並且與日本學生交流。',
    year: 110,
    major: '工設系',
    timestamp: '2023-08-14 08:40:58',
    confirm: 'true',
    category: [{ id: 'c6276e00-df74-4050-85b7-d026ecfbfd34', name: '海外交換' }],
    statistic: [],
    otherStat: [],
  },
  {
    id: 'd9d24a14-3f77-4fac-906f-075f5eff6636',
    title: '轉系後的學分抵免和選課',
    content:
      'Q: 轉系後的學分抵免怎麼運作的?\nA:  要關注轉入系的公告，照公告寫的方式處理。以108年資訊系為例:使用學校的轉系生學分抵免線上系統，照以下方式操作:\n1. 抵免轉入系的本系選必修 =>點選要拿來抵跟被抵的課後，附上課綱。\n2. 抵免轉入系的外系選修=>點選「以原科目名稱抵免」\n3.申請轉通識=>點選「申請通識中心抵免」',
    year: 108,
    major: '其他',
    timestamp: '2022-07-10 09:38:49',
    confirm: 'true',
    category: [
      { id: 'e207cd12-60d2-4bb5-a8d4-4c44b364df29', name: '學校行政' },
      { id: 'f8383414-e780-4e7b-b84f-cd839e3ea919', name: '轉輔雙主' },
    ],
    statistic: [],
    otherStat: [],
  },
];

let store: StudyDTO[] = [...seedData];

export class MockStudyRepository implements StudyRepository {
  async findAll(filters?: StudyFilters): Promise<StudyDTO[]> {
    let result = [...store];
    if (filters?.category) {
      result = result.filter((s) =>
        s.category.some((c) => c.id === filters.category || c.name === filters.category)
      );
    }
    if (filters?.year) {
      result = result.filter((s) => String(s.year) === String(filters.year));
    }
    if (filters?.confirm !== undefined) {
      const confirmStr = String(filters.confirm);
      result = result.filter((s) => s.confirm === confirmStr);
    }
    return result;
  }

  async findById(id: string): Promise<StudyDTO | null> {
    return store.find((s) => s.id === id) ?? null;
  }

  async create(data: CreateStudyInput): Promise<StudyDTO> {
    const item: StudyDTO = { id: randomUUID(), ...data };
    store.push(item);
    return { ...item };
  }

  async update(id: string, data: UpdateStudyInput): Promise<StudyDTO | null> {
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

  async confirm(id: string): Promise<StudyDTO | null> {
    const idx = store.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    store[idx] = { ...store[idx], confirm: 'true' };
    return { ...store[idx] };
  }
}
