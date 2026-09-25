"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { adminApiFetch, apiFetch } from '@/lib/api-client';
import { CommentDTO, PaginatedResponse } from '@/types/api';
import { TransCard } from './TransCard';
import { MajorFilters, FilterState } from './MajorFilters';
import { MajorStatistics } from './MajorStatistics';
import StatisticControl from './StatisticControl';
import AdminReaderModal from './AdminReaderModal';
import { ALL_COMMENTS_QUERY_KEY } from '@/lib/query-keys';
import MajorModal from './MajorModal';
import { useOptionalMajorModalRoute } from './MajorModalRouteContext';
import { MAJOR_CARDS_CONTAINER_CLASS, MajorCardsSkeleton } from '@/components/layout/PageSkeletons';

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
  const commentsQueryKey = isAdmin
    ? (isDefaultFilter ? ['admin-comments'] : ['admin-comments', filters])
    : (isDefaultFilter ? ALL_COMMENTS_QUERY_KEY : ['comments', filters]);

  const { data, isLoading, isError } = useQuery({
    queryKey: commentsQueryKey,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.college) params.append('college', filters.college);
      if (filters.department) params.append('department', filters.department);
      if (filters.year) params.append('year', filters.year);
      if (filters.category) params.append('category', filters.category);
      if (!isAdmin) params.set('confirm', 'true');

      const queryString = params.toString();
      const path = queryString ? '/comments?' + queryString : '/comments';

      const result = isAdmin
        ? await adminApiFetch<CommentDTO[] | PaginatedResponse<CommentDTO>>(path)
        : await apiFetch<CommentDTO[] | PaginatedResponse<CommentDTO>>(path);
      // API may return a plain array or a paginated wrapper — normalise to wrapper
      return Array.isArray(result)
        ? ({ data: result, total: result.length } satisfies PaginatedResponse<CommentDTO>)
        : result;
    },
    staleTime: isAdmin ? 0 : 60_000,
    gcTime: isAdmin ? 0 : 60_000,
  });

  const comments = data?.data || [];

  return (
    <main className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden max-sm:-mx-4">
      <div className="h-20 max-lg:h-40 max-sm:h-36">
        <MajorFilters filters={filters} onChange={setFilters} isAdmin={isAdmin} />
      </div>
      <StatisticControl>
        <MajorStatistics comments={comments} filters={filters} />
      </StatisticControl>
      
      {isLoading && (
        <MajorCardsSkeleton />
      )}
      
      {isError && (
        <div className="flex flex-1 min-h-0 flex-wrap justify-start items-start bg-white w-full h-full max-h-full rounded-lg overflow-x-hidden gap-2.5">
          <span className="text-red">{tCommon('error')}</span>
        </div>
      )}

      {!isLoading && !isError && comments.length === 0 && (
        <div className="flex flex-1 min-h-0 flex-wrap justify-start items-start bg-white w-full h-full max-h-full rounded-lg overflow-x-hidden gap-2.5 text-light-black">
          {t('noResults')}
        </div>
      )}

      {!isLoading && !isError && comments.length > 0 && (
        <div className={MAJOR_CARDS_CONTAINER_CLASS}>
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
