import { unstable_cache } from 'next/cache';
import { getCommentRepository, getStudyRepository } from '@/lib/repositories';

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
