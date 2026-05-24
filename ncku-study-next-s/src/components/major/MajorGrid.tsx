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
    <div className="flex flex-col w-full h-full">
      <MajorFilters filters={filters} onChange={setFilters} />
      
      {isLoading && (
        <div className="flex flex-wrap justify-start items-start bg-white p-5 rounded-[20px] shadow-[0_0_10px_rgba(0,0,0,0.1)] gap-6 content-start min-h-[500px]">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-[220px] h-[180px] rounded-lg bg-[var(--color-dark-white)] animate-pulse"
            />
          ))}
        </div>
      )}
      
      {isError && (
        <div className="flex flex-wrap justify-start items-start bg-white p-5 rounded-[20px] shadow-[0_0_10px_rgba(0,0,0,0.1)] gap-6 content-start min-h-[500px]">
          <span className="text-[var(--color-red)]">{tCommon('error')}</span>
        </div>
      )}

      {!isLoading && !isError && comments.length === 0 && (
        <div className="flex flex-wrap justify-start items-start bg-white p-5 rounded-[20px] shadow-[0_0_10px_rgba(0,0,0,0.1)] gap-6 content-start min-h-[500px] text-[var(--color-light-black)]">
          {t('noResults')}
        </div>
      )}

      {!isLoading && !isError && comments.length > 0 && (
        <div className="flex flex-wrap justify-start items-start bg-white p-5 rounded-[20px] shadow-[0_0_10px_rgba(0,0,0,0.1)] gap-6 content-start min-h-[500px]">
          {comments.map((comment) => (
            <TransCard key={comment.id} data={comment} />
          ))}
        </div>
      )}
    </div>
  );
}
