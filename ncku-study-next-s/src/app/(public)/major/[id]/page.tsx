import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getCommentRepository } from '@/lib/repositories';
import { getQueryClient } from '@/lib/query-client';
import { prefetchAllComments } from '@/lib/prefetch-comments';
import MajorDetailClient from '@/components/major/MajorDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

function isClientNavigation(requestHeaders: Headers) {
  return requestHeaders.get('RSC') === '1';
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (isClientNavigation(await headers())) return {};

  const { id } = await params;
  const [repo, t] = await Promise.all([
    getCommentRepository(),
    getTranslations('site'),
  ]);
  const comment = await repo.findById(parseInt(id, 10));
  if (!comment) return {};
  return {
    title: t('majorDetailTitle', { year: comment.year, inMaj: comment.in_maj, category: comment.category }),
    description: comment.comment,
  };
}

export default async function MajorDetailPage({ params }: Props) {
  const { id } = await params;
  const numId = parseInt(id, 10);

  if (!Number.isInteger(numId)) notFound();

  // Next uses an RSC request for client-side Link/router navigation. Do not
  // execute the server repository path for that request: MajorDetailClient
  // will read the already hydrated list from React Query on the browser.
  if (isClientNavigation(await headers())) {
    return <MajorDetailClient id={numId} />;
  }

  const queryClient = getQueryClient();
  const repo = await getCommentRepository();

  const [comment] = await Promise.all([
    repo.findById(numId),
    prefetchAllComments(queryClient),
  ]);

  if (!comment) {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MajorDetailClient id={numId} serverComment={comment} />
    </HydrationBoundary>
  );
}
