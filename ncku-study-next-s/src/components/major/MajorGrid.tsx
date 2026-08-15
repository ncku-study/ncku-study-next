"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import { CommentDTO, PaginatedResponse } from '@/types/api';
import { TransCard } from './TransCard';
import { MajorFilters, FilterState } from './MajorFilters';
import { MajorStatistics } from './MajorStatistics';
import StatisticControl from './StatisticControl';
import AdminReaderModal from './AdminReaderModal';
import { ALL_COMMENTS_QUERY_KEY } from '@/lib/query-keys';
import MajorModal from './MajorModal';
import { useOptionalMajorModalRoute } from './MajorModalRouteContext';

export default function MajorGrid({ isAdmin = false, renderClientModal = true }: { isAdmin?: boolean; renderClientModal?: boolean }) {
  const t = useTranslations('major');
  const tCommon = useTranslations('common');

  const [filters, setFilters] = useState<FilterState>({
    college: '',
    department: '',
    year: '',
    category: '',
  });
  const [selectedComment, setSelectedComment] = useState<CommentDTO | null>(null);
  const majorRoute = useOptionalMajorModalRoute();

  const isDefaultFilter = filters.college === '' && filters.department === '' && filters.year === '' && filters.category === '';

  const { data, isLoading, isError } = useQuery({
    queryKey: isDefaultFilter ? ALL_COMMENTS_QUERY_KEY : ['comments', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.college) params.append('college', filters.college);
      if (filters.department) params.append('department', filters.department);
      if (filters.year) params.append('year', filters.year);
      if (filters.category) params.append('category', filters.category);

      const queryString = params.toString();
      const path = queryString ? '/comments?' + queryString : '/comments';

      const result = await apiFetch<CommentDTO[] | PaginatedResponse<CommentDTO>>(path);
      // API may return a plain array or a paginated wrapper — normalise to wrapper
      return Array.isArray(result)
        ? ({ data: result, total: result.length } satisfies PaginatedResponse<CommentDTO>)
        : result;
    },
    staleTime: 5 * 60 * 1000,
  });

  const comments = data?.data || [];

  return (
    <main className="grid h-full min-h-0 min-w-0 grid-rows-[50px_160px_minmax(0,1fr)] overflow-hidden max-[990px]:grid-rows-[100px_160px_minmax(0,1fr)] max-[576px]:grid-rows-[90px_0px_minmax(0,1fr)] max-[576px]:-mx-[10px]">
      <MajorFilters filters={filters} onChange={setFilters} />
      <StatisticControl>
        <MajorStatistics comments={comments} />
      </StatisticControl>
      
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
        <div className="flex min-h-0 min-w-0 flex-wrap justify-start items-start bg-white w-full h-full rounded-[10px] overflow-x-hidden overflow-y-auto max-[576px]:gap-0 gap-[10px] [&::-webkit-scrollbar]:w-[1px] [&::-webkit-scrollbar]:h-[1px] [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-[#555] [&::-webkit-scrollbar-track]:bg-transparent">
          {comments.map((comment) => (
            <TransCard key={comment.id} data={comment} isAdmin={isAdmin} onOpen={isAdmin ? setSelectedComment : undefined} />
          ))}
        </div>
      )}

      {isAdmin && selectedComment && (
        <AdminReaderModal
          comment={selectedComment}
          allComments={comments}
          onClose={() => setSelectedComment(null)}
          onNavigate={setSelectedComment}
        />
      )}

      {!isAdmin && renderClientModal && majorRoute?.majorId !== null && majorRoute?.majorId !== undefined && (
        <MajorModal
          id={majorRoute.majorId}
          onClose={() => majorRoute.close('/major')}
        />
      )}
    </main>
  );
}
