'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import type { StudyDTO } from '@/types/api';
import { StudyCard } from './StudyCard';
import { CategoryFilter } from './CategoryFilter';
import { Loader2 } from 'lucide-react';

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

  return (
    <div className="w-full">
      <CategoryFilter
        selectedCategories={selectedCategories}
        onChange={setSelectedCategories}
      />
      
      <div className="mb-6 flex gap-2 items-center">
        <label htmlFor="year-select" className="text-sm font-medium text-gray-700">
          {t('filterByYear')}
        </label>
        <select
          id="year-select"
          className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="">{t('allYears')}</option>
          <option value="113">113</option>
          <option value="112">112</option>
          <option value="111">111</option>
          <option value="110">110</option>
          <option value="109">109</option>
          <option value="108">108</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
        </div>
      ) : isError ? (
        <div className="text-center py-10 text-red-500">
          {t('error') || '發生錯誤'}
        </div>
      ) : studies.length === 0 ? (
        <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          {t('noResults')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {studies.map((study) => (
            <StudyCard key={study.id} study={study} />
          ))}
        </div>
      )}
    </div>
  );
}
