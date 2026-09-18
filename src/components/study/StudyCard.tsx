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
      className={`study-card relative h-64 border-b border-card-border border-l-0 box-border max-sm:w-full max-sm:m-0 max-sm:rounded-none ${isConfirmed ? 'bg-white' : 'bg-light-yellow'}`}
    >
      {isAdmin ? (
        <Link href={href} className="absolute top-0 left-0 w-full h-3/4 opacity-0 border-none outline-none z-30" aria-label={t('viewStudy', { title: study.title })}>
          <span className="sr-only">{study.title}</span>
        </Link>
      ) : (
        <a href={href} onClick={handleClientNavigation} className="absolute top-0 left-0 w-full h-3/4 opacity-0 border-none outline-none z-30" aria-label={t('viewStudy', { title: study.title })}>
          <span className="sr-only">{study.title}</span>
        </a>
      )}
      
      <div className="w-full h-35 mt-8 z-20 relative" style={{ height: '88px' }}>
        <div className="inline-flex">
          {study.category.map((cat) => (
            <span
              key={cat.id}
              className="inline-flex items-center mr-2 h-10 rounded-full font-normal text-[14px] px-4 py-1 bg-background-yellow text-dark-yellow"
              style={{ height: '26px', paddingBlock: '3px' }}
            >
              {cat.name}
            </span>
          ))}
        </div>

        <h4 className="text-[18px] mt-5 mb-2" style={{ marginTop: '12px', marginBottom: '6px' }}>
          {study.title}
        </h4>

        <p className="text-[14px] text-justify break-anywhere mt-0 mb-4 max-sm:text-[1.5rem]" style={{ wordBreak: 'break-all', lineBreak: 'anywhere' }}>
          {contentPreview}
        </p>
      </div>

      <div className="mt-4 flex items-center z-20 pointer-events-none">
        <span className="text-yellow mr-6 text-[14px]">#{study.year}</span>
        {study.statistic.map((stat, i) => (
            <span key={i} className="text-yellow mr-6 text-[14px]">#{stat.name}</span>
        ))}
      </div>
    </div>
  );
}
