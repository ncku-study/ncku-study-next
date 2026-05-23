import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { CommentDTO } from '@/types/api';
import { Badge } from './Badge';

interface TransCardProps {
  data: CommentDTO;
}

export function TransCard({ data }: TransCardProps) {
  const t = useTranslations('major');

  // Preview comment logic (truncate if too long)
  const commentPreview = data.comment.length > 30
    ? data.comment.substring(0, 30) + '...'
    : data.comment;

  return (
    <Link href={`/major/${data.id}`} className="block group">
      <div className="w-[220px] h-[180px] rounded-lg shadow-md bg-[var(--color-white)] border border-[var(--color-light-gray)] overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col p-4 relative group-hover:border-[var(--color-yellow)]">
        
        {/* Header: Department & Year */}
        <div className="flex justify-between items-start mb-2">
          <span className="font-bold text-[var(--color-light-black)] truncate max-w-[120px]" title={data.department}>
            {data.department}
          </span>
          <span className="text-xs text-[var(--color-dark-gray)] bg-[var(--color-dark-white)] px-2 py-0.5 rounded-full">
            {data.year}
          </span>
        </div>

        {/* Score and Pass/Fail Badge */}
        <div className="flex items-center gap-2 mb-3">
          <Badge isPass={data.isPass} />
          <span className="text-sm font-semibold text-[var(--color-dark-black)]">
            {t('score')}: {data.score}
          </span>
        </div>

        {/* Comment Preview */}
        <div className="text-sm text-[var(--color-light-black)] line-clamp-3 mt-1 flex-1">
          {commentPreview}
        </div>

      </div>
    </Link>
  );
}
