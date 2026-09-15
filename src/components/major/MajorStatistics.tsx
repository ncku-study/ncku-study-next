"use client";

import React from 'react';
import { ProgressArc } from '@/components/logos';
import type { CommentDTO } from '@/types/api';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import type { FilterState } from './MajorFilters';

const OFFICIAL_PASS_RATE_URL =
  'https://script.google.com/macros/s/AKfycbx7m5jeetEwjtZ8vbicrH8VfQ7tBp_hGyTWX7d73a5NQANmTvU/exec';

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
    <div className="relative w-[115px] flex justify-items-center items-center flex-col">
      <div style={{ position: 'relative', width: '70px', margin: '0 11.25px' }}>
        <ProgressArc value={value} size={70} />
        <span className="absolute text-[1.9rem] flex w-full justify-center text-dark-black" style={{ top: '21px', left: 0 }}>
          {displayValue}
        </span>
      </div>
      <h4 className="flex justify-center text-[1.4rem] my-[7px] mx-0">{name}</h4>
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
  const { data: officialPassRate, isFetching: isPassRateLoading } = useQuery({
    queryKey: ['official-pass-rate', officialPassRateMajor, officialPassRateYear],
    enabled: isTransferCategory,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    queryFn: async ({ signal }) => {
      const body = new URLSearchParams({
        major: officialPassRateMajor,
        year: officialPassRateYear,
      });
      const response = await fetch(OFFICIAL_PASS_RATE_URL, {
        method: 'POST',
        body: body.toString(),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        signal,
      });

      if (!response.ok) {
        throw new Error(`Official pass rate request failed with status ${response.status}`);
      }

      const result: unknown = await response.json();
      const value =
        typeof result === 'object' && result !== null && 'passRate' in result
          ? Number(result.passRate)
          : Number.NaN;

      return Number.isFinite(value) ? value : null;
    },
  });

  return (
    <section className="h-full grid grid-cols-[400px_auto] gap-x-[20px] py-[10px] max-[576px]:h-[160px] max-[576px]:grid-cols-[1fr_0] max-[576px]:gap-x-0">
      <div className="bg-white w-full h-full rounded-[10px] flex items-center justify-evenly">
        <ProgressCircle value={average} name={t('averageScore')} noValue={t('noValue')} />
        <ProgressCircle value={min} name={t('minimumScore')} noValue={t('noValue')} />
        <ProgressCircle
          value={!isTransferCategory || isPassRateLoading || officialPassRate === null || officialPassRate === undefined
            ? null
            : officialPassRate * 100}
          name={t('officialPassRate')}
          noValue={t('noValue')}
        />
      </div>
    </section>
  );
}
