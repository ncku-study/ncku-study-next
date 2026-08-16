"use client";
import React, { useEffect, useReducer } from 'react';
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
      case '\u8f49\u7cfb':
        return { bg: 'bg-background-yellow', text: 'text-dark-yellow', metaText: 'text-dark-yellow' };
      case '\u8f14\u7cfb':
        return { bg: 'bg-[rgba(29,30,34,0.2)]', text: 'text-dark-black', metaText: 'text-dark-black' };
      case '\u96d9\u4e3b\u4fee':
      default:
        return { bg: 'bg-[var(--color-light-black)]', text: 'text-white', metaText: 'text-[var(--color-light-black)]' };
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
    <div className={`relative border border-black/12.5 p-[5px] text-black rounded-[15px] h-[180px] w-[220px] box-border max-sm:border-x-0 max-sm:border-t-0 max-sm:w-full max-sm:m-0 max-sm:rounded-none max-sm:h-[145px] ${cls}`}>
      <div className={`grid box-border grid-cols-[57px_auto] grid-rows-[auto_30px] [grid-template-areas:'icon_main'_'year_tags'] w-[210px] h-[160px] px-[10px] pt-[5px] pb-0 max-sm:w-full max-sm:h-[125px]`}>
        <div className={`flex justify-center items-center font-semibold [grid-area:icon] w-[42px] h-[42px] rounded-[42px] my-[10px] mx-auto ${bg} ${text}`}>
          {data.category ? data.category[0] : ''}
        </div>
        <div className="grid grid-rows-[35px_25px_auto] [grid-area:main]">
          <h4 className="text-[1.8rem] mt-[10px] mb-[10px] leading-[1.1]">
            {data.in_maj}
          </h4>
          <div className="text-dark-gray text-[1.2rem]">{'\u539f\u4e3b\u4fee'} {data.out_maj}</div>
          <p className="text-[1.3rem] text-justify mt-0 mb-[1rem] max-sm:text-[1.5rem]" style={{ lineBreak: 'anywhere' }}>
            {preview}
          </p>
        </div>
        <div className={`flex items-center justify-center text-[1.2rem] [grid-area:year] ${metaText}`}>{data.year}</div>
        <div className="flex items-center [grid-area:tags]">
          <span className={`mr-[10px] text-[1.2rem] ${metaText}`}>{data.department}</span>
        </div>
      </div>

      {!isAdmin && (
        <a href={href} onClick={handleClientNavigation} className="absolute top-0 left-0 w-full h-[75%] opacity-0">{'\u8a73\u7d30\u5167\u5bb9'}</a>
      )}

      {isAdmin && onOpen && (
        <button
          onClick={() => onOpen(data)}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="\u958b\u555f\u8a73\u7d30\u5167\u5bb9"
        />
      )}
    </div>
  );
}
