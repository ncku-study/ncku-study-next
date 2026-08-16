import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { prefetchAllComments } from '@/lib/prefetch-comments';
import { buildSeoMetadata } from '@/lib/seo/metadata';
import { getTranslations } from 'next-intl/server';
import MajorGrid from '@/components/major/MajorGrid';

export async function generateMetadata() {
  const t = await getTranslations('site');
  return buildSeoMetadata({
    title: t('title'),
    description: t('description'),
    pathname: '/major',
  });
}

export default async function MajorPage() {
  const queryClient = getQueryClient();
  await prefetchAllComments(queryClient);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MajorGrid />
    </HydrationBoundary>
  );
}
