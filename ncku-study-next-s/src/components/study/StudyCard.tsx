import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { StudyDTO } from '@/types/api';
import Link from 'next/link';

interface StudyCardProps {
  study: StudyDTO;
}

export function StudyCard({ study }: StudyCardProps) {
  const t = useTranslations('study');

  // Same truncation logic (approximate line-clamp)
  const isConfirmed = study.confirm === 'true';

  return (
    <Card className={`relative flex flex-col p-4 mb-4 transition-colors ${isConfirmed ? 'bg-white' : 'bg-yellow-50'} border-b border-gray-200 shadow-sm hover:shadow-md h-[160px] overflow-hidden`}>
      <Link href={`/study/${study.id}`} className="absolute inset-0 z-10" aria-label={`View study ${study.title}`}>
        <span className="sr-only">{study.title}</span>
      </Link>
      
      <div className="flex gap-2 mb-2 z-20">
        {study.category.map((cat) => (
          <Badge key={cat.id} variant="secondary" className="rounded-[30px] font-normal text-xs px-2 py-0.5">
            {cat.name}
          </Badge>
        ))}
        {study.statistic.map((stat, i) => (
          <Badge key={`stat-${i}`} variant="outline" className="rounded-[30px] font-normal text-xs px-2 py-0.5 border-[var(--color-primary)] text-[var(--color-primary)]">
            {stat.name}: {stat.value}
          </Badge>
        ))}
      </div>

      <h4 className="text-[18px] font-medium mt-1 mb-2 truncate" title={study.title}>
        {study.title}
      </h4>

      <p className="text-[14px] text-justify text-gray-600 line-clamp-2 leading-relaxed flex-grow">
        {study.content}
      </p>

      <div className="flex items-center gap-3 mt-auto pt-2 text-sm text-[var(--color-primary)]">
        <span className="font-medium">#{study.year}</span>
        <span className="font-medium text-gray-500">{study.major}</span>
      </div>
    </Card>
  );
}
