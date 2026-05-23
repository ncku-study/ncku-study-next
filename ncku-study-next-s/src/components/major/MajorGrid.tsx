"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import { CommentDTO, PaginatedResponse } from '@/types/api';
import { TransCard } from './TransCard';
import { MajorFilters, FilterState } from './MajorFilters';

interface MajorGridProps {
  initialData?: PaginatedResponse<CommentDTO>;
}

export default function MajorGrid({ initialData }: MajorGridProps) {
  const t = useTranslations('major');
  const tCommon = useTranslations('common');
  
  const [filters, setFilters] = useState<FilterState>({
    college: '',
    department: '',
    year: ''
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['comments', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.department) params.append('department', filters.department);
      if (filters.year) params.append('year', filters.year);
      
      const queryString = params.toString();
      const path = queryString ? '/comments?' + queryString : '/comments';
      
      return apiFetch<PaginatedResponse<CommentDTO>>(path);
    },
    initialData: filters.department === '' && filters.year === '' ? initialData : undefined,
  });

  const comments = data?.data || [];

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6 text-[var(--color-dark-black)]">{t('title')}</h1>
      
      <MajorFilters filters={filters} onChange={setFilters} />
      
      {isLoading && (
        <div className="flex justify-center items-center min-h-[200px]">
          <span className="text-[var(--color-dark-gray)]">{tCommon('loading')}...</span>
        </div>
      )}
      
      {isError && (
        <div className="flex justify-center items-center min-h-[200px]">
          <span className="text-[var(--color-red)]">{tCommon('error')}</span>
        </div>
      )}

      {!isLoading && !isError && comments.length === 0 && (
        <div className="flex justify-center items-center min-h-[200px] text-[var(--color-light-black)] bg-[var(--color-dark-white)] rounded-lg">
          {t('noResults')}
        </div>
      )}

      {!isLoading && !isError && comments.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
          {comments.map((comment) => (
            <TransCard key={comment.id} data={comment} />
          ))}
        </div>
      )}
    </div>
  );
}
