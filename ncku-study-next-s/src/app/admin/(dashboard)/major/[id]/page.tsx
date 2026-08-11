'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import type { CommentDTO } from '@/types/api';
import MajorGrid from '@/components/major/MajorGrid';
import ModalOverlay from '@/components/major/ModalOverlay';
import { ModalPrevBtn, ModalNextBtn } from '@/components/major/ModalChangeBtns';
import ModalContent from '@/components/major/ModalContent';

export default function AdminMajorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const numId = parseInt(params.id as string, 10);
  const [waitDelete, setWaitDelete] = useState(false);

  const { data: comment, isLoading } = useQuery<CommentDTO>({
    queryKey: ['comment', numId],
    queryFn: () => apiFetch<CommentDTO>(`/comments/${numId}`),
    staleTime: 5 * 60 * 1000,
  });

  const confirmMutation = useMutation({
    mutationFn: () => apiFetch<CommentDTO>(`/comments/${numId}`, { method: 'PATCH' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comment', numId] });
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => apiFetch<void>(`/comments/${numId}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      router.push('/admin/major');
    },
  });

  const isConfirmed = comment?.confirm === 'true';

  return (
    <>
      <MajorGrid isAdmin />

      <ModalOverlay backHref="/admin/major">
        <div
          className="relative w-[600px] h-[700px] max-h-[75vh] bg-white text-black grid max-lg:w-[360px] max-lg:max-h-[65vh] max-lg:min-w-[95vw]"
          style={{ gridTemplateColumns: '50px auto 50px', gridTemplateRows: '100%' }}
        >
          <ModalPrevBtn currentId={numId} basePath="/admin/major" />

          {/* Middle column */}
          <div className="flex flex-col overflow-hidden p-[5px]">
            {isLoading || !comment ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[var(--color-yellow)] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Confirm toggle — vite Confirm style: justify-end */}
                <div className="h-[50px] shrink-0 flex items-center justify-end gap-[10px]">
                  <p className="mr-[10px] m-0">{"\u662f\u5426\u5df2\u5be9\u67e5"}</p>
                  <button
                    onClick={() => confirmMutation.mutate()}
                    disabled={confirmMutation.isPending}
                    className={`relative inline-flex items-center w-[54px] h-[26px] rounded-full transition-colors duration-200 disabled:opacity-50 ${
                      isConfirmed ? 'bg-[var(--color-yellow)]' : 'bg-gray-300'
                    }`}
                    aria-pressed={isConfirmed}
                  >
                    <span
                      className={`absolute top-[3px] w-[20px] h-[20px] bg-white rounded-full shadow transition-transform duration-200 ${
                        isConfirmed ? 'translate-x-[30px]' : 'translate-x-[3px]'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                  <ModalContent id={numId} serverComment={comment} />
                </div>

                {/* AdvanceAdmin — matches vite AdvanceAdmin */}
                <div className="mt-[50px] h-[50px] shrink-0 flex items-center justify-end gap-[6px]">
                  {!waitDelete ? (
                    <>
                      <button
                        disabled={deleteMutation.isPending}
                        onClick={() => setWaitDelete(true)}
                        className="h-[40px] w-[120px] bg-white border-2 border-[var(--color-yellow)] text-[var(--color-light-black)] cursor-pointer hover:brightness-75 disabled:opacity-50"
                      >
                        {"\u522a\u9664\u6b64\u5fc3\u5f97"}
                      </button>
                      <button
                        onClick={() => router.push(`/admin/post?type=major&id=${numId}`)}
                        className="h-[40px] w-[110px] bg-[var(--color-yellow)] text-[var(--color-light-black)] cursor-pointer hover:brightness-75"
                      >
                        {"\u7de8\u8f2f"}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        disabled={deleteMutation.isPending}
                        onClick={() => deleteMutation.mutate()}
                        className="h-[40px] w-[120px] bg-white border-2 border-[var(--color-yellow)] text-[var(--color-light-black)] cursor-pointer hover:brightness-75 disabled:opacity-50"
                      >
                        {"\u78ba\u8a8d\u522a\u9664"}
                      </button>
                      <p className="font-bold m-[10px] text-sm">{"\u771f\u7684\u8981\u522a\u9664\u9019\u500b\u5fc3\u5f97\u55ce?"}</p>
                      <button
                        disabled={deleteMutation.isPending}
                        onClick={() => setWaitDelete(false)}
                        className="h-[40px] w-[110px] bg-[var(--color-yellow)] text-[var(--color-light-black)] cursor-pointer hover:brightness-75 disabled:opacity-50"
                      >
                        {"\u53d6\u6d88"}
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          <ModalNextBtn currentId={numId} basePath="/admin/major" />
        </div>
      </ModalOverlay>
    </>
  );
}
