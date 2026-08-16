import type { AnnouncementDTO } from '@/types/api';
import type { AnnouncementRepository, UpdateAnnouncementInput } from '../interfaces';

const seedData: AnnouncementDTO[] = [
  {
    id: 1,
    msg: '我們發現了一個錯誤，導致在2025/08/24 ~ 2025/08/30 之間送出的心得沒有被正常儲存。目前錯誤已經修正，需要請在這段送出心得的同學協助我們重新分享。不好意思造成困擾，開發團隊會努力改善，感謝大家協助!',
    isShow: 'true',
    created_at: null,
    updated_at: '2025-08-30 08:05:58',
  },
];

const store: AnnouncementDTO[] = [...seedData];

export class MockAnnouncementRepository implements AnnouncementRepository {
  async findAll(): Promise<AnnouncementDTO[]> {
    return [...store];
  }

  async update(id: number, data: UpdateAnnouncementInput): Promise<AnnouncementDTO | null> {
    const idx = store.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    store[idx] = {
      ...store[idx],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return { ...store[idx] };
  }
}
