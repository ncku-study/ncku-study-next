"use client";
import React, { useEffect, useReducer } from 'react';
import { useTranslations } from 'next-intl';
import { CommentDTO } from '@/types/api';
import { useOptionalMajorModalRoute } from '@/components/major/MajorModalRouteContext';

const contentMiddleware = (content: string, maxNumber: number) =>
  content.length < maxNumber ? content : content.substr(0, maxNumber - 1) + '  (...)';

function reducer(state: number, action: { type: string }) {
  switch (action.type) {
    case 'PC':
      return 27;
    case 'mobile':
      return 15;
    default:
      return state;
  }
}

interface TransCardProps {
  data: CommentDTO;
  isAdmin?: boolean;
  onOpen?: (comment: CommentDTO) => void;
}

export function TransCard({ data, isAdmin = false, onOpen }: TransCardProps) {
  const t = useTranslations('major');
  const [wordsNumber, dispatch] = useReducer(reducer, 27);
  const majorRoute = useOptionalMajorModalRoute();

  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 870) dispatch({ type: 'PC' });
      else dispatch({ type: 'mobile' });
    }
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const plain = (data.comment || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const preview = contentMiddleware(plain, wordsNumber);

  const getCategoryStyles = (category: string | undefined) => {
    switch (category) {
      case t('categoryTransfer'):
        return { bg: 'bg-background-yellow', text: 'text-dark-yellow', metaText: 'text-dark-yellow' };
      case t('categoryMinor'):
        return { bg: 'bg-minor-surface', text: 'text-dark-black', metaText: 'text-dark-black' };
      case t('categoryDouble'):
      default:
        return { bg: 'bg-light-black', text: 'text-white', metaText: 'text-light-black' };
    }
  };

  const isConfirmed = data.confirm === 'true';
  const cls = (!isConfirmed ? 'bg-lightYellow' : 'bg-white');
  const { bg, text, metaText } = getCategoryStyles(data.category);
  const href = `/major/${data.id}`;

  const handleClientNavigation = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!majorRoute || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    majorRoute.navigate(href);
  };

  return (
    <div className={`relative border border-card-border p-2 text-card-text rounded-2xl h-72 w-88 box-border max-sm:border-x-0 max-sm:border-t-0 max-sm:w-full max-sm:m-0 max-sm:rounded-none max-sm:h-58 ${cls}`}>
      <div className="grid box-border w-84 h-64 px-4 pt-2 pb-0 max-sm:w-full max-sm:h-50" style={{ gridTemplateColumns: '57px auto', gridTemplateRows: 'auto 30px', gridTemplateAreas: '"icon main" "year tags"' }}>
        <div className={`flex justify-center items-center font-semibold w-16 h-16 scale-105 translate-y-px will-change-transform rounded-full my-4 mx-auto ${bg} ${text}`} style={{ gridArea: 'icon' }}>
          {data.category ? data.category[0] : ''}
        </div>
        <div className="grid" style={{ gridTemplateRows: '35px 25px auto', gridArea: 'main' }}>
          <h4 className="text-[1.8rem] mt-4 mb-4" style={{ lineHeight: 1.1 }}>
            {data.in_maj}
          </h4>
          <div className="text-dark-gray text-[1.2rem]">{t('originalMajor')} {data.out_maj}</div>
          <p className="text-[1.3rem] text-justify mt-0 mb-4 max-sm:text-[1.5rem]" style={{ lineBreak: 'anywhere' }}>
            {preview}
          </p>
        </div>
        <div className={`flex items-center justify-center text-[1.2rem] ${metaText}`} style={{ gridArea: 'year' }}>{data.year}</div>
        <div className="flex items-center" style={{ gridArea: 'tags' }}>
          <span className={`mr-4 text-[1.2rem] ${metaText}`}>{data.department}</span>
        </div>
      </div>

      {!isAdmin && (
        <a href={href} onClick={handleClientNavigation} className="absolute top-0 left-0 w-full h-3/4 opacity-0">{t('viewDetails')}</a>
      )}

      {isAdmin && onOpen && (
        <button
          onClick={() => onOpen(data)}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          aria-label={t('openDetails')}
        />
      )}
    </div>
  );
}
