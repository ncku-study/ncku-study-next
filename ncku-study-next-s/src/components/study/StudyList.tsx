'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { adminApiFetch, apiFetch } from '@/lib/api-client';
import type { StudyDTO } from '@/types/api';
import { StudyCard } from './StudyCard';
import { StudyFilterPopup, type StudyFilterState } from './StudyFilterPopup';
import StudyModal from './StudyModal';
import { useOptionalStudyModalRoute } from '@/components/major/MajorModalRouteContext';
import { ALL_STUDIES_QUERY_KEY } from '@/lib/query-keys';

export function StudyList({ isAdmin = false, renderClientModal = true }: { isAdmin?: boolean; renderClientModal?: boolean }) {
  const t = useTranslations('study');
  const [filter, setFilter] = useState<StudyFilterState>({ categories: [], stats: [], years: [] });
  const studyRoute = useOptionalStudyModalRoute();
  const isDefaultFilter = filter.categories.length === 0 && filter.stats.length === 0 && filter.years.length === 0;
  const studiesQueryKey = isAdmin
    ? (isDefaultFilter ? ['admin-studies'] : ['admin-studies', filter])
    : (isDefaultFilter ? ALL_STUDIES_QUERY_KEY : ['studies', filter]);

  const { data: studies = [], isLoading, isError } = useQuery<StudyDTO[]>({
    queryKey: studiesQueryKey,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filter.categories.length > 0) params.set('category', filter.categories.join(','));
      if (filter.stats.length > 0) params.set('stat_id', filter.stats.join(','));
      if (filter.years.length > 0) params.set('year', filter.years.join(','));
      const qs = params.toString();
      const path = `/studies${qs ? `?${qs}` : ''}`;
      return isAdmin
        ? adminApiFetch<StudyDTO[]>(path)
        : apiFetch<StudyDTO[]>(path);
    },
    staleTime: isAdmin ? 0 : 60_000,
    gcTime: isAdmin ? 0 : 60_000,
  });

  return (
    <div className="grid grid-cols-[600px_auto] overflow-y-hidden grid-rows-[50px_auto] max-[576px]:grid-cols-[100vw] max-[576px]:-mx-[10px]">
      <section className="flex items-center flex-wrap px-[5px] w-fit h-[50px] mb-[10px] row-start-1 col-start-1 col-end-2">
        <div className="relative m-[8px] min-w-[120px]">
          <StudyFilterPopup filter={filter} onFilterChange={setFilter} isAdmin={isAdmin} />
        </div>
      </section>

      <section className="col-start-1 col-end-2 row-start-2 row-end-3 max-[576px]:overflow-y-auto">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[145px] rounded-lg bg-[var(--color-dark-white)] animate-pulse"
            />
          ))}
          </div>
        ) : isError ? (
          <div className="text-center py-10 text-[var(--color-red)]">
            {t('error')}
          </div>
        ) : studies.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            {t('noResults')}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-0 w-[590px] max-sm:w-auto max-sm:mx-[10px]">
            {studies.map((study) => (
              <StudyCard key={study.id} study={study} isAdmin={isAdmin} />
            ))}
          </div>
        )}
      </section>

      {!isAdmin && renderClientModal && studyRoute?.studyId !== null && studyRoute?.studyId !== undefined && (
        <StudyModal
          id={studyRoute.studyId}
          studies={studies}
          onClose={() => studyRoute.close('/study')}
        />
      )}
    </div>
  );
}
