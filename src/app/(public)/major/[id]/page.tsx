import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getPublicComment } from '@/lib/public-cache';
import { getQueryClient } from '@/lib/query-client';
import { prefetchAllComments } from '@/lib/prefetch-comments';
import { buildSeoMetadata } from '@/lib/seo/metadata';
import MajorDetailClient from '@/components/major/MajorDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

export const revalidate = 30;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const t = await getTranslations('site');
  const comment = await getPublicComment(parseInt(id, 10));
  const pathname = `/major/${encodeURIComponent(id)}`;

  if (!comment || comment.confirm !== 'true') {
    return buildSeoMetadata({
      title: t('title'),
      description: t('description'),
      pathname,
    });
  }

  return buildSeoMetadata({
    title: t('majorDetailTitle', { year: comment.year, inMaj: comment.in_maj, category: comment.category }),
    description: comment.comment,
    pathname,
    openGraphType: 'article',
  });
}

export default async function MajorDetailPage({ params }: Props) {
  const { id } = await params;
  const numId = parseInt(id, 10);

  if (!Number.isInteger(numId)) notFound();

  const comment = await getPublicComment(numId);

  if (!comment) notFound();
  if (comment.confirm !== 'true') redirect('/major');

  const queryClient = getQueryClient();
  await prefetchAllComments(queryClient);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MajorDetailClient id={numId} serverComment={comment} />
    </HydrationBoundary>
  );
}
