import { StudyList } from '@/components/study/StudyList';
import { getTranslations } from 'next-intl/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { prefetchAllStudies } from '@/lib/prefetch-studies';
import { buildSeoMetadata } from '@/lib/seo/metadata';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const t = await getTranslations('site');
  return buildSeoMetadata({
    title: t('title'),
    description: t('description'),
    pathname: '/study',
  });
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
