import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { prefetchAllComments } from '@/lib/prefetch-comments';
import MajorGrid from '@/components/major/MajorGrid';

export default async function MajorPage() {
  const queryClient = getQueryClient();
  await prefetchAllComments(queryClient);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MajorGrid />
    </HydrationBoundary>
  );
}

