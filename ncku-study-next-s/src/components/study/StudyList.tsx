'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import type { StudyDTO } from '@/types/api';
import { StudyCard } from './StudyCard';
import { CategoryFilter } from './CategoryFilter';

const selectClass = "border border-[#c4c4c4] rounded-[4px] bg-transparent px-[14px] pt-[14.5px] pb-[6.5px] text-[1.5rem] focus:outline-none focus:border-[var(--color-yellow)] focus:ring-1 focus:ring-[var(--color-yellow)] min-w-[100px]";

export function StudyList() {
  const t = useTranslations('study');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('');

  const { data: studies = [], isLoading, isError } = useQuery<StudyDTO[]>({
    queryKey: ['studies', selectedCategories, selectedYear],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategories.length > 0) {
        params.append('category', selectedCategories[0]); 
      }
      if (selectedYear) {
        params.append('year', selectedYear);
      }
      
      const queryString = params.toString();
      const path = queryString ? `/studies?${queryString}` : '/studies';
      return apiFetch(path);
    },
  });

  // Dynamic year range matching Vite (current ROC year down to 104)
  const currentRocYear = new Date().getFullYear() - 1911;
  const years = Array.from(
    { length: currentRocYear - 104 + 1 },
    (_, i) => currentRocYear - i
  );

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <CategoryFilter
          selectedCategories={selectedCategories}
          onChange={setSelectedCategories}
        />
        <div className="flex items-center gap-2">
          <span className="mr-[10px] text-[1.5rem]">{t('filterByYear')} :</span>
          <select
            className={selectClass}
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">{t('allYears')}</option>
            {years.map((y) => (
              <option key={y} value={y.toString()} className="text-[15px]">{y}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studies.map((study) => (
            <StudyCard key={study.id} study={study} />
          ))}
        </div>
      )}
    </div>
  );
}
