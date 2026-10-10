import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getPublicStudy } from '@/lib/public-cache';
import { getQueryClient } from '@/lib/query-client';
import { prefetchAllStudies } from '@/lib/prefetch-studies';
import { buildSeoMetadata } from '@/lib/seo/metadata';
import StudyDetailClient from '@/components/study/StudyDetailClient';

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
  const study = await getPublicStudy(id);
  const pathname = `/study/${encodeURIComponent(id)}`;

  if (!study || study.confirm !== 'true') {
    return buildSeoMetadata({
      title: t('title'),
      description: t('description'),
      pathname,
    });
  }

  return buildSeoMetadata({
    title: t('studyDetailTitle', { title: study.title }),
    description: study.content,
    pathname,
    openGraphType: 'article',
  });
}

export default async function StudyDetailPage({ params }: Props) {
  const { id } = await params;

  const study = await getPublicStudy(id);

  if (!study) notFound();
  if (study.confirm !== 'true') redirect('/study');

  const queryClient = getQueryClient();
  await prefetchAllStudies(queryClient);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StudyDetailClient id={id} serverStudy={study} />
    </HydrationBoundary>
  );
}
