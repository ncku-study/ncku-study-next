'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { apiFetch } from '@/lib/api-client';
import type { StudyDTO } from '@/types/api';
import { StudyList } from '@/components/study/StudyList';

function formatTimestamp(timestamp: string): string {
  const match = /\d{4}-\d{2}-\d{2}/.exec(timestamp);
  return match ? match[0] : timestamp;
}

function normalizeArray<T>(value: T[] | string | unknown): T[] {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try { return JSON.parse(value); } catch { return []; }
  }
  return [];
}

export default function AdminStudyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id as string;
  const [waitDelete, setWaitDelete] = useState(false);

  const { data: study, isLoading } = useQuery<StudyDTO>({
    queryKey: ['study', id],
    queryFn: () => apiFetch<StudyDTO>(`/studies/${id}`),
    staleTime: 5 * 60 * 1000,
  });

  const { data: allStudies = [] } = useQuery<StudyDTO[]>({
    queryKey: ['studies', { categories: [], stats: [], years: [] }],
    queryFn: () => apiFetch<StudyDTO[]>('/studies'),
    staleTime: 5 * 60 * 1000,
  });

  const confirmMutation = useMutation({
    mutationFn: () => apiFetch<StudyDTO>(`/studies/${id}`, { method: 'PATCH' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study', id] });
      queryClient.invalidateQueries({ queryKey: ['studies'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => apiFetch<void>(`/studies/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studies'] });
      router.push('/admin/study');
    },
  });

  const currentIndex = allStudies.findIndex((s) => s.id === id);
  const prevStudy = currentIndex > 0 ? allStudies[currentIndex - 1] : null;
  const nextStudy = currentIndex >= 0 && currentIndex < allStudies.length - 1 ? allStudies[currentIndex + 1] : null;

  const categories = normalizeArray<{ id: string; name: string }>(study?.category);
  const statistics = normalizeArray<{ id?: string; name?: string; value?: string | number }>(study?.statistic);
  const otherStats = normalizeArray<{ id: string; name: string; value: string; study_id: string }>(study?.otherStat);

  const allStats = [
    ...statistics.filter((s) => s.name != null && s.value != null).map((s) => ({
      name: s.name!,
      value: String(s.value!),
      isOther: false,
    })),
    ...otherStats.map((s) => ({ name: s.name, value: s.value, isOther: true })),
  ];

  const isConfirmed = study?.confirm === 'true';
  const postTime = study ? `${study.year}（發文時間：${formatTimestamp(study.timestamp)}）` : '';

  return (
    <>
      {/* Background: StudyList positioned to match NavLayout structure */}
      <div className="fixed inset-0 pointer-events-none select-none">
        <div className="ml-[140px] mt-[70px]">
          <StudyList isAdmin />
        </div>
      </div>

      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={() => router.push('/admin/study')} />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 outline-none">
        <div
          className="grid grid-cols-[50px_auto_50px] w-[600px] h-[90vh] bg-white"
          style={{ gridTemplateRows: '100%' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left chevron */}
          {prevStudy ? (
            <Link
              href={`/admin/study/${prevStudy.id}`}
              className="border-0 cursor-pointer bg-white h-full flex items-center justify-center"
              aria-label="previous"
            >
              <svg className="w-[35px] h-[35px]" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </Link>
          ) : (
            <div className="bg-white" />
          )}

          {/* Content column */}
          <div className="flex flex-col relative col-start-2 overflow-hidden">
            {/* Confirm toggle — vite Confirm style */}
            <div className="h-[50px] shrink-0 flex items-center justify-end gap-[10px] px-1">
              <p className="mr-[10px] m-0">{"\u662f\u5426\u5df2\u5be9\u67e5"}</p>
              <button
                onClick={() => confirmMutation.mutate()}
                disabled={confirmMutation.isPending || isLoading}
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

            {isLoading || !study ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[var(--color-yellow)] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="flex-1 min-h-0 flex flex-col py-[25px] overflow-hidden">
                {/* Categories */}
                <div className="inline-flex shrink-0">
                  {categories.map((cat) => (
                    <span
                      key={cat.id}
                      className="flex items-center px-[10px] py-[3px] bg-[rgba(254,218,106,0.4)] text-[#E1AF13] text-[14px] select-none rounded-[30px] mr-[10px]"
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>

                <h4 className="text-[18px] mt-[15px] shrink-0">{study.title}</h4>
                <span className="text-[16px] text-[#8c8c8c] shrink-0">{postTime}</span>

                <div className="inline-flex my-[10px] h-[50px] shrink-0">
                  {allStats.map((stat, idx) => (
                    <div key={idx} className="grid grid-rows-[12px_auto] h-[50px] min-w-[75px] mr-[10px]">
                      <div className="text-[12px]">{stat.isOther ? `\u5176\u4ed6: ${stat.name}` : stat.name}</div>
                      <div className="text-[24px]">{stat.value}</div>
                    </div>
                  ))}
                </div>

                <div className="flex-1 min-h-0 my-[5px] text-justify leading-[2.8rem] tracking-[2.5px] overflow-y-auto [overflow-wrap:anywhere] whitespace-pre-line custom-scrollbar">
                  {study.content.replace(/<br\s*\/?>/gi, '\n')}
                </div>

                {/* AdvanceAdmin — matches vite AdminAdvance layout */}
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
                        onClick={() => router.push(`/admin/post?type=study&id=${id}`)}
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
              </div>
            )}
          </div>

          {/* Right chevron */}
          {nextStudy ? (
            <Link
              href={`/admin/study/${nextStudy.id}`}
              className="border-0 cursor-pointer bg-white h-full flex items-center justify-center"
              aria-label="next"
            >
              <svg className="w-[35px] h-[35px]" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </Link>
          ) : (
            <div className="bg-white" />
          )}
        </div>
      </div>
    </>
  );
}
