'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import type { CategoryDTO, StudyDTO } from '@/types/api';
import { ALL_STUDIES_QUERY_KEY } from '@/lib/query-keys';
import { useOptionalStudyModalRoute } from '@/components/major/MajorModalRouteContext';
import { useTranslations } from 'next-intl';
import { useClientSeo } from '@/lib/seo/use-client-seo';
import StudyModalOverlay from './StudyModalOverlay';

interface StudyModalProps {
  id: string;
  studies?: StudyDTO[];
  serverStudy?: StudyDTO;
  onClose?: () => void;
}

function parseArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (typeof value !== 'string') return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed as T[] : [];
  } catch {
    return [];
  }
}

function formatTimestamp(timestamp: string): string {
  const match = /\d{4}-\d{2}-\d{2}/.exec(timestamp);
  return match ? match[0] : timestamp;
}

function isPlainLeftClick(event: React.MouseEvent<HTMLAnchorElement>) {
  return event.button === 0
    && !event.metaKey
    && !event.ctrlKey
    && !event.shiftKey
    && !event.altKey;
}

function StudyArrow({
  direction,
  href,
  onNavigate,
}: {
  direction: 'previous' | 'next';
  href: string | null;
  onNavigate: (href: string) => void;
}) {
  const arrow = (
    <svg className="w-14 h-14" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
      {direction === 'previous' ? (
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
      ) : (
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
      )}
    </svg>
  );

  if (!href) {
    return <div className="bg-white" />;
  }

  return (
    <a
      href={href}
      className="border-0 cursor-pointer bg-white h-full flex items-center justify-center"
      aria-label={direction}
      onClick={(event) => {
        if (!isPlainLeftClick(event)) return;
        event.preventDefault();
        onNavigate(href);
      }}
    >
      {arrow}
    </a>
  );
}

export default function StudyModal({ id, studies, serverStudy, onClose }: StudyModalProps) {
  const t = useTranslations('site');
  const tStudy = useTranslations('study');
  const queryClient = useQueryClient();
  const studyRoute = useOptionalStudyModalRoute();
  const cachedStudies = queryClient.getQueryData<StudyDTO[]>(ALL_STUDIES_QUERY_KEY);
  const localStudies = studies && studies.length > 0 ? studies : undefined;
  const hasLocalStudyList = Boolean(localStudies?.some((study) => study.id === id));

  const { data: fetchedStudies = [], isLoading } = useQuery<StudyDTO[]>({
    queryKey: ALL_STUDIES_QUERY_KEY,
    queryFn: () => apiFetch<StudyDTO[]>('/studies'),
    initialData: cachedStudies,
    enabled: !hasLocalStudyList && !cachedStudies,
    staleTime: 60_000,
  });

  const availableStudies = cachedStudies ?? (fetchedStudies.length > 0 ? fetchedStudies : localStudies ?? []);
  const study = availableStudies.find((item) => item.id === id) ?? serverStudy;
  const currentIndex = availableStudies.findIndex((item) => item.id === id);
  const previousStudy = currentIndex > 0 ? availableStudies[currentIndex - 1] : null;
  const nextStudy = currentIndex >= 0 && currentIndex < availableStudies.length - 1
    ? availableStudies[currentIndex + 1]
    : null;

  const navigateToStudy = (href: string) => {
    if (studyRoute) {
      studyRoute.navigate(href);
    } else {
      window.location.assign(href);
    }
  };

  const categories = parseArray<CategoryDTO>(study?.category);
  const statistics = parseArray<{ name?: string; value?: string | number }>(study?.statistic);
  const otherStats = parseArray<{ name: string; value: string }>(study?.otherStat);
  const allStats = [
    ...statistics
      .filter((stat) => stat.name != null && stat.value != null)
      .map((stat) => ({ name: stat.name!, value: String(stat.value), isOther: false })),
    ...otherStats.map((stat) => ({ name: stat.name, value: stat.value, isOther: true })),
  ];

  useClientSeo({
    baseline: {
      title: t('title'),
      description: t('description'),
      pathname: '/study',
      openGraphType: 'website',
    },
    detail: study
      ? {
          title: t('studyDetailTitle', { title: study.title }),
          description: study.content,
          pathname: `/study/${encodeURIComponent(id)}`,
          openGraphType: 'article',
        }
      : undefined,
  });

  return (
    <StudyModalOverlay onClose={onClose}>
      <div
        className="study-modal grid w-240 max-xl:w-144 bg-white"
        style={{ gridTemplateColumns: '50px minmax(0, 1fr) 50px', gridTemplateRows: '100%' }}
        role="dialog"
        aria-modal="true"
        aria-label={study?.title ?? 'Study detail'}
      >
        <StudyArrow
          direction="previous"
          href={previousStudy ? `/study/${previousStudy.id}` : null}
          onNavigate={navigateToStudy}
        />

        <div className="flex flex-col relative col-start-2 py-10 overflow-hidden">
          {isLoading || !study ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-yellow border-t-filter-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="inline-flex">
                {categories.map((category) => (
                  <span
                    key={category.id}
                    className="flex items-center px-4 py-1 bg-background-yellow text-dark-yellow text-[14px] select-none rounded-full mr-4"
                    style={{ paddingBlock: '3px' }}
                  >
                    {category.name}
                  </span>
                ))}
              </div>

              <h4 className="text-[18px] mt-6">{study.title}</h4>
              <span className="text-[16px] text-muted-text">
                {tStudy('postedAt', { year: study.year, date: formatTimestamp(study.timestamp) })}
              </span>

              <div className="inline-flex my-4 h-20">
                {allStats.map((stat, index) => (
                  <div key={index} className="grid h-20 min-w-30 mr-4" style={{ gridTemplateRows: '12px auto' }}>
                    <div className="text-[12px]">{stat.isOther ? `${tStudy('otherPrefix')}: ${stat.name}` : stat.name}</div>
                    <div className="text-[24px]">{stat.value}</div>
                  </div>
                ))}
              </div>

              <div className="h-full my-2 text-justify leading-11 overflow-y-auto whitespace-pre-line custom-scrollbar" style={{ letterSpacing: '2.5px', lineHeight: '2.8rem', overflowWrap: 'anywhere' }}>
                {study.content.replace(/<br\s*\/?>(\r?\n)?/gi, '\n')}
              </div>
            </>
          )}
        </div>

        <StudyArrow
          direction="next"
          href={nextStudy ? `/study/${nextStudy.id}` : null}
          onNavigate={navigateToStudy}
        />
      </div>
    </StudyModalOverlay>
  );
}
