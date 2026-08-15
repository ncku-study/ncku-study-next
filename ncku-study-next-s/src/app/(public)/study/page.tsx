import { StudyList } from '@/components/study/StudyList';
import { getTranslations } from 'next-intl/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { prefetchAllStudies } from '@/lib/prefetch-studies';

export async function generateMetadata() {
  const t = await getTranslations('study');
  return {
    title: t('title'),
  };
}

export default async function StudyPage() {
  const queryClient = getQueryClient();
  await prefetchAllStudies(queryClient);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StudyList />
    </HydrationBoundary>
  );
}
