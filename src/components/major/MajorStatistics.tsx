"use client";

import React from 'react';
import { ProgressArc } from '@/components/logos';
import type { CommentDTO } from '@/types/api';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import type { FilterState } from './MajorFilters';

interface ProgressCircleProps {
  value: number | null;
  name: string;
}

function ProgressCircle({ value, name, noValue }: ProgressCircleProps & { noValue: string }) {
  // Replicate rc-progress Circle: viewBox 0 0 100 100, r=48, strokeWidth=4 for progress, 1 for trail
  // Path starts from top: M 50,50 m 0,-48 a 48,48 0 1 1 0,96 a 48,48 0 1 1 0,-96
  const percent = value === null ? 100 : Math.min(100, Math.round(value * 100) / 100);
  const displayValue = value === null ? noValue : Number(percent).toFixed(1);

  return (
    <div className="relative w-46 flex justify-items-center items-center flex-col">
      <div className="relative w-28 mx-4">
        <div className="translate-y-px">
          <ProgressArc value={value} size={70} />
        </div>
        <span className="absolute text-[1.9rem] flex w-full justify-center text-dark-black" style={{ top: '21px', left: 0 }}>
          {displayValue}
        </span>
      </div>
      <h4 className="flex justify-center text-[1.4rem] my-3 mx-0">{name}</h4>
    </div>
  );
}

interface MajorStatisticsProps {
  comments: CommentDTO[];
  filters: FilterState;
}

export function MajorStatistics({ comments, filters }: MajorStatisticsProps) {
  const t = useTranslations('major');
  const passedComments = comments.filter((c) => c.isPass !== 'false');
  // Coerce scores to numbers to avoid string/number union issues
  const numericScores = passedComments
    .map((c) => {
      const n = Number(c.score);
      return Number.isFinite(n) ? n : 0;
    })
    .filter((n) => !Number.isNaN(n));

  const average = numericScores.length > 0 ? numericScores.reduce((s, v) => s + v, 0) / numericScores.length : null;

  const min = numericScores.length > 0 ? Math.min(...numericScores) : null;

  const isTransferCategory = filters.category === t('categoryTransfer');
  const officialPassRateMajor = filters.department || filters.college || 'none';
  const officialPassRateYear = filters.year || 'none';
  const { data: officialPassRate, isPending: isPassRateLoading } = useQuery({
    queryKey: ['official-pass-rate', officialPassRateMajor, officialPassRateYear],
    enabled: isTransferCategory,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    queryFn: async ({ signal }) => {
      const query = new URLSearchParams({
        major: officialPassRateMajor,
        year: officialPassRateYear,
      });
      const response = await fetch(`/api/v2/pass-rate?${query}`, {
        signal,
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Official pass rate request failed with status ${response.status}`);
      }

      const result: unknown = await response.json();
      const value =
        typeof result === 'object' && result !== null && 'passRate' in result
          ? result.passRate
          : null;

      return typeof value === 'number' && Number.isFinite(value) ? value : null;
    },
  });

  return (
    <section className="h-full flex gap-8 py-4 max-sm:h-64">
      <div className="bg-white w-160 h-full rounded-lg flex-none flex items-center justify-evenly max-sm:w-full">
        <ProgressCircle value={average} name={t('averageScore')} noValue={t('noValue')} />
        <ProgressCircle value={min} name={t('minimumScore')} noValue={t('noValue')} />
        {isTransferCategory && isPassRateLoading ? (
          <div className="relative w-46 flex flex-col items-center" role="status" aria-label={`${t('officialPassRate')} loading`}>
            <div className="w-28 h-[70px] flex items-center justify-center">
              <div className="relative h-[70px] w-[70px] rounded-full border-4 border-gray-200 animate-pulse flex items-center justify-center">
                <div className="rounded-lg bg-gray-200 text-[1.9rem] leading-none" aria-hidden="true"><span className="invisible">xx.x</span></div>
              </div>
            </div>
            <h4 className="flex justify-center text-[1.4rem] my-3 mx-0">{t('officialPassRate')}</h4>
          </div>
        ) : (
          <ProgressCircle
            value={!isTransferCategory || officialPassRate === null || officialPassRate === undefined
              ? null
              : officialPassRate * 100}
            name={t('officialPassRate')}
            noValue={t('noValue')}
          />
        )}
      </div>
    </section>
  );
}
