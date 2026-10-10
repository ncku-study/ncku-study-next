import { unstable_cache } from 'next/cache';
import {
  getAnnouncementRepository,
  getCategoryRepository,
  getCollegeRepository,
  getCommentRepository,
  getDepartmentRepository,
  getStatisticRepository,
  getStudyRepository,
} from '@/lib/repositories';

// Request parameters become part of the cache key. Admin routes continue to
// access repositories directly so moderation changes are never delayed here.
export const getPublicComments = unstable_cache(
  async (college?: string, department?: string, year?: string, category?: string) => {
    const repo = await getCommentRepository();
    return repo.findAll({ college, department, year, category, confirm: true });
  },
  ['public-comments'],
  { revalidate: 30 },
);

export const getPublicComment = unstable_cache(
  async (id: number) => {
    const repo = await getCommentRepository();
    const item = await repo.findById(id);
    return item;
  },
  ['public-comment'],
  { revalidate: 30 },
);

export const getPublicStudies = unstable_cache(
  async (category?: string, year?: string) => {
    const repo = await getStudyRepository();
    return repo.findAll({ category, year, confirm: true });
  },
  ['public-studies'],
  { revalidate: 30 },
);

export const getPublicStudy = unstable_cache(
  async (id: string) => {
    const repo = await getStudyRepository();
    const item = await repo.findById(id);
    return item;
  },
  ['public-study'],
  { revalidate: 30 },
);

// These public lookups run only after a request reaches a dynamic route.
// Keep their database results for the same 30 seconds as the other public APIs.
export const getPublicAnnouncements = unstable_cache(
  async () => (await getAnnouncementRepository()).findAll(),
  ['public-announcements'],
  { revalidate: 30 },
);

export const getPublicCategories = unstable_cache(
  async () => (await getCategoryRepository()).findAll(),
  ['public-categories'],
  { revalidate: 30 },
);

export const getPublicColleges = unstable_cache(
  async () => (await getCollegeRepository()).findAll(),
  ['public-colleges'],
  { revalidate: 30 },
);

export const getPublicDepartments = unstable_cache(
  async () => (await getDepartmentRepository()).findAll(),
  ['public-departments'],
  { revalidate: 30 },
);

export const getPublicStatistics = unstable_cache(
  async () => (await getStatisticRepository()).findAll(),
  ['public-statistics'],
  { revalidate: 30 },
);
