'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import type { StudyDTO } from '@/types/api';
import { StudyCard } from './StudyCard';
import { StudyFilterPopup, type StudyFilterState } from './StudyFilterPopup';

export function StudyList() {
  const t = useTranslations('study');
  const [filter, setFilter] = useState<StudyFilterState>({ categories: [], stats: [], years: [] });

  const { data: studies = [], isLoading, isError } = useQuery<StudyDTO[]>({
    queryKey: ['studies'],
    queryFn: async () => {
      return apiFetch('/studies');
    },
  });

  return (
    <div className="grid grid-cols-[600px_auto] overflow-y-hidden grid-rows-[50px_auto] max-[576px]:grid-cols-[100vw] max-[576px]:-mx-[10px]">
      <section className="row-start-1 col-start-1 col-end-2 flex items-center w-fit h-[50px] mb-[10px]">
        <div className="relative w-[550px] mt-[18px] max-sm:w-[90vw]">
          <input
            className="w-full h-[45px] rounded-[55px] border border-black/5 bg-transparent py-[10px] px-[15px] text-[1.5rem] outline-none"
            aria-label="search"
            readOnly
            value=""
          />
          <svg
            className="pointer-events-none absolute right-[12px] top-1/2 -translate-y-1/2 w-[2.1875rem] h-[2.1875rem]"
            viewBox="0 0 24 24"
            aria-hidden="true"
            style={{ fill: 'var(--color-yellow)' }}
          >
            <path d="M15.5 14h-.79l-.28-.27A6.5 6.5 0 1 0 14 15.5l.27.28v.79L20 21.5 21.5 20l-6-6zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z" />
          </svg>
        </div>
      </section>

      <section className="col-start-1 col-end-2 row-start-2 row-end-3 max-w-[600px]">
        <div className="relative m-[8px] mt-[28px] mb-[8px] ml-[13px] w-[109px]">
          <StudyFilterPopup filter={filter} onFilterChange={setFilter} />
        </div>

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
          <div className="grid grid-cols-1 gap-0 w-[590px] max-sm:w-full">
            {studies.map((study) => (
              <StudyCard key={study.id} study={study} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
