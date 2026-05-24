"use client";

import React from 'react';
import type { CommentDTO } from '@/types/api';

interface ProgressCircleProps {
  value: number | null;
  name: string;
}

function ProgressCircle({ value, name }: ProgressCircleProps) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const percent = value === null ? 100 : Math.min(100, Math.round(value * 100) / 100);
  const dash = (percent / 100) * circumference;
  const displayValue = value === null ? '無' : Number(value).toFixed(1);

  return (
    <div className="relative w-[115px] flex justify-items-center items-center flex-col">
      <div style={{ position: 'relative', width: '70px', margin: '0 11.25px' }}>
        <svg viewBox="0 0 100 100" width="70" height="70">
          {/* Trail */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="rgba(163, 158, 158, 1)"
            strokeWidth="4"
          />
          {/* Progress */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#FEDA6A"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
            strokeDashoffset={circumference / 4}
            style={{ transition: 'stroke-dasharray 0.3s ease' }}
          />
        </svg>
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

  const average =
    passedComments.length > 0
      ? passedComments.reduce((sum, c) => sum + (c.score || 0), 0) / passedComments.length
      : null;

  const min =
    passedComments.length > 0
      ? passedComments.reduce(
          (m, c) => (c.score < m ? c.score : m),
          passedComments[0].score
        )
      : null;

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
