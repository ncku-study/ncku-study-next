import { useTranslations } from 'next-intl';
import type { StudyDTO } from '@/types/api';
import Link from 'next/link';

interface StudyCardProps {
  study: StudyDTO;
}

function contentMiddleware(content: string, maxNumber: number): string {
  return content.length < maxNumber
    ? content
    : content.substring(0, maxNumber - 1) + '  (...)';
}

export function StudyCard({ study }: StudyCardProps) {
  const t = useTranslations('study');
  const isConfirmed = study.confirm === 'true';
  const contentPreview = contentMiddleware(study.content, 36);

  return (
    <div
      data-testid="study-card"
      className={`study-card relative h-[160px] border-b border-black/12.5 border-l-0 box-border max-sm:w-full max-sm:m-0 max-sm:rounded-none max-sm:h-[145px] ${isConfirmed ? 'bg-white' : 'bg-[var(--color-light-yellow)]'}`}
    >
      <Link href={`/study/${study.id}`} className="absolute top-0 left-0 w-full h-[75%] opacity-0 border-none outline-none z-10" aria-label={t('viewStudy', { title: study.title })}>
        <span className="sr-only">{study.title}</span>
      </Link>
      
      <div className="w-full h-[88px] mt-[20px] z-20 relative">
        <div className="inline-flex">
          {study.category.map((cat) => (
            <span
              key={cat.id}
              className="mr-[5px] rounded-[30px] font-normal text-[14px] px-[10px] py-[3px] bg-[var(--color-background-yellow)] text-[var(--color-dark-yellow)]"
            >
              {cat.name}
            </span>
          ))}
        </div>

        <h4 className="text-[18px] mt-[12px] mb-[6px]">
          {study.title}
        </h4>

        <p className="text-[14px] text-justify break-anywhere mt-0 mb-[1rem] max-sm:text-[1.5rem]" style={{ wordBreak: 'break-all', lineBreak: 'anywhere' }}>
          {contentPreview}
        </p>
      </div>

      <div className="mt-[6px] flex items-center z-20 pointer-events-none">
        <span className="text-[var(--color-yellow)] mr-[15px] text-[14px]">#{study.year}</span>
        {study.statistic.map((stat, i) => (
            <span key={i} className="text-[var(--color-yellow)] mr-[15px] text-[14px]">#{stat.name}</span>
        ))}
      </div>
    </div>
  );
}
