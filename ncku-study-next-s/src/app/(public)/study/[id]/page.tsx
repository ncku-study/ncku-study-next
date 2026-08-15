import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getStudyRepository } from '@/lib/repositories';
import { getQueryClient } from '@/lib/query-client';
import { prefetchAllStudies } from '@/lib/prefetch-studies';
import { buildSeoMetadata } from '@/lib/seo/metadata';
import StudyDetailClient from '@/components/study/StudyDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

function isClientNavigation(requestHeaders: Headers) {
  return requestHeaders.get('RSC') === '1';
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const [repo, t] = await Promise.all([
    getStudyRepository(),
    getTranslations('site'),
  ]);
  const study = await repo.findById(id);
  const pathname = `/study/${encodeURIComponent(id)}`;

  if (!study) {
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

  // A client-side modal navigation is handled by the public modal route
  // context. Keep this branch as a safe fallback for Next RSC navigations.
  if (isClientNavigation(await headers())) {
    return <StudyDetailClient id={id} />;
  }

  const queryClient = getQueryClient();
  const repo = await getStudyRepository();
  const [study] = await Promise.all([
    repo.findById(id),
    prefetchAllStudies(queryClient),
  ]);

  if (!study) {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StudyDetailClient id={id} serverStudy={study} />
    </HydrationBoundary>
  );
}
