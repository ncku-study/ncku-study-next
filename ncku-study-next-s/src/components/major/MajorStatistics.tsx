"use client";

import React from 'react';
import { ProgressArc } from '@/components/logos';
import type { CommentDTO } from '@/types/api';

interface ProgressCircleProps {
  value: number | null;
  name: string;
}

function ProgressCircle({ value, name }: ProgressCircleProps) {
  // Replicate rc-progress Circle: viewBox 0 0 100 100, r=48, strokeWidth=4 for progress, 1 for trail
  // Path starts from top: M 50,50 m 0,-48 a 48,48 0 1 1 0,96 a 48,48 0 1 1 0,-96
  // Circumference = 2 * PI * 48 ≈ 301.593
  const circumference = 301.593;
  const percent = value === null ? 100 : Math.min(100, Math.round(value * 100) / 100);
  const dash = (percent / 100) * circumference;
  const displayValue = value === null ? '無' : Number(percent).toFixed(1);
  const arcPath = 'M 50,50 m 0,-48\n   a 48,48 0 1 1 0,96\n   a 48,48 0 1 1 0,-96';

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
}

export function MajorStatistics({ comments }: MajorStatisticsProps) {
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

  return (
    <section className="grid grid-cols-[400px_auto] gap-x-[20px] py-[10px] max-[576px]:h-[160px] max-[576px]:grid-cols-[1fr_0] max-[576px]:gap-x-0">
      <div className="bg-white w-full h-full rounded-[10px] flex items-center justify-evenly">
        <ProgressCircle value={average} name="平均錄取分數" />
        <ProgressCircle value={min} name="最低錄取分數" />
        <ProgressCircle value={null} name="通過率(官方數據)" />
      </div>
    </section>
  );
}
