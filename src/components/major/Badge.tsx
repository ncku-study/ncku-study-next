import React from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface BadgeProps {
  isPass: boolean | string;
  className?: string;
}

export function Badge({ isPass, className }: BadgeProps) {
  const t = useTranslations('major');
  const passed = isPass === true || isPass === 'true';

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center px-3 py-1 text-sm font-medium text-white rounded-[30px]',
        passed ? 'bg-[var(--color-green)] text-[var(--color-dark-black)]' : 'bg-[var(--color-red)]',
        className
      )}
    >
      {passed ? t('pass') : t('fail')}
    </span>
  );
}
