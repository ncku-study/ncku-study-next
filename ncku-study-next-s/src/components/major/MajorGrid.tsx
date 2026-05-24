"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import { CommentDTO, PaginatedResponse } from '@/types/api';
import { TransCard } from './TransCard';
import { MajorFilters, FilterState } from './MajorFilters';
import { MajorStatistics } from './MajorStatistics';

interface MajorGridProps {
  initialData?: PaginatedResponse<CommentDTO>;
}

export default function MajorGrid({ initialData }: MajorGridProps) {
  const t = useTranslations('major');
  const tCommon = useTranslations('common');
  
  const [filters, setFilters] = useState<FilterState>({
    college: '',
    department: '',
    year: '',
    category: '',
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['comments', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.department) params.append('department', filters.department);
      if (filters.year) params.append('year', filters.year);
      if (filters.category) params.append('category', filters.category);
      
      const queryString = params.toString();
      const path = queryString ? '/comments?' + queryString : '/comments';
      
      return apiFetch<PaginatedResponse<CommentDTO>>(path);
    },
    initialData: filters.department === '' && filters.year === '' && filters.category === '' ? initialData : undefined,
  });

  const comments = data?.data || [];

  return (
    <main className="grid grid-rows-[50px_160px_auto] overflow-hidden max-[990px]:grid-rows-[100px_auto] max-[576px]:grid-rows-[90px_auto] max-[576px]:-mx-[10px] w-full h-full">
      <MajorFilters filters={filters} onChange={setFilters} />
      <MajorStatistics comments={comments} />
      
      {isLoading && (
        <div className="flex flex-wrap justify-start items-start bg-white w-full h-full max-h-full rounded-[10px] overflow-x-hidden gap-[10px]">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-[220px] h-[180px] rounded-lg bg-[var(--color-dark-white)] animate-pulse"
            />
          ))}
        </div>
      )}
      
      {isError && (
        <div className="flex flex-wrap justify-start items-start bg-white w-full h-full max-h-full rounded-[10px] overflow-x-hidden gap-[10px]">
          <span className="text-[var(--color-red)]">{tCommon('error')}</span>
        </div>
      )}

      {!isLoading && !isError && comments.length === 0 && (
        <div className="flex flex-wrap justify-start items-start bg-white w-full h-full max-h-full rounded-[10px] overflow-x-hidden gap-[10px] text-[var(--color-light-black)]">
          {t('noResults')}
        </div>
      )}

      {!isLoading && !isError && comments.length > 0 && (
        <div className="flex flex-wrap justify-start items-start bg-white w-full h-full max-h-full rounded-[10px] overflow-x-hidden min-[576px]:overflow-y-auto gap-[10px]">
          {comments.map((comment) => (
            <TransCard key={comment.id} data={comment} />
          ))}
        </div>
      )}
    </main>
  );
}
