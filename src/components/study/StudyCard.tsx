import { useEffect, useReducer } from 'react';
import { useTranslations } from 'next-intl';
import type { StudyDTO } from '@/types/api';
import Link from 'next/link';
import { useOptionalStudyModalRoute } from '@/components/major/MajorModalRouteContext';

interface StudyCardProps {
  study: StudyDTO;
  isAdmin?: boolean;
}

function contentMiddleware(content: string, maxNumber: number): string {
  return content.length < maxNumber
    ? content
    : content.substring(0, maxNumber - 1) + '  (...)';
}

function reducer(state: number, action: { type: string }): number {
  switch (action.type) {
    case 'PC': return 36;
    case 'mobile': return 21;
    default: return state;
  }
}

export function StudyCard({ study, isAdmin = false }: StudyCardProps) {
  const t = useTranslations('study');
  const studyRoute = useOptionalStudyModalRoute();
  const isConfirmed = study.confirm === 'true';
  const [wordsNumber, dispatch] = useReducer(reducer, 36);

  const href = isAdmin ? `/admin/study/${study.id}` : `/study/${study.id}`;
  const handleClientNavigation = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (isAdmin || !studyRoute || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    studyRoute.navigate(href);
  };

  useEffect(() => {
    function handleResize() {
      const w = window.innerWidth;
      if (w >= 870) {
        dispatch({ type: 'PC' });
      } else {
        dispatch({ type: 'mobile' });
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const contentPreview = contentMiddleware(study.content, wordsNumber);

  return (
    <div
      data-testid="study-card"
      className={`study-card relative h-[160px] border-b border-black/12.5 border-l-0 box-border max-sm:w-full max-sm:m-0 max-sm:rounded-none ${isConfirmed ? 'bg-white' : 'bg-[var(--color-light-yellow)]'}`}
    >
      {isAdmin ? (
        <Link href={href} className="absolute top-0 left-0 w-full h-[75%] opacity-0 border-none outline-none z-30" aria-label={t('viewStudy', { title: study.title })}>
          <span className="sr-only">{study.title}</span>
        </Link>
      ) : (
        <a href={href} onClick={handleClientNavigation} className="absolute top-0 left-0 w-full h-[75%] opacity-0 border-none outline-none z-30" aria-label={t('viewStudy', { title: study.title })}>
          <span className="sr-only">{study.title}</span>
        </a>
      )}
      
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

      <div className="mt-[10px] flex items-center z-20 pointer-events-none">
        <span className="text-[var(--color-yellow)] mr-[15px] text-[14px]">#{study.year}</span>
        {study.statistic.map((stat, i) => (
            <span key={i} className="text-[var(--color-yellow)] mr-[15px] text-[14px]">#{stat.name}</span>
        ))}
      </div>
    </div>
  );
}
