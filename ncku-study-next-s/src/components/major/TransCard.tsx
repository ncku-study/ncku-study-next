"use client";
import React, { useEffect, useReducer } from 'react';
import Link from 'next/link';
import { CommentDTO } from '@/types/api';
import { useSidebar } from '@/components/sidebar/SidebarContext';

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

export function TransCard({ data }: { data: CommentDTO }) {
  const [wordsNumber, dispatch] = useReducer(reducer, 27);
  const { setPendingHref } = useSidebar();

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
      case '轉系':
        return { bg: 'bg-background-yellow', text: 'text-dark-yellow' };
      case '輔系':
        return { bg: 'bg-[rgba(29,30,34,0.2)]', text: 'text-dark-black' };
      case '雙主修':
      default:
        return { bg: 'bg-[var(--color-light-black)]', text: 'text-white' };
    }
  };

  const cls = (data.confirm === 'false' ? 'bg-lightYellow' : 'bg-white');
  const { bg, text } = getCategoryStyles(data.category);

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
          <div className="text-dark-gray text-[1.2rem]">原主修 {data.out_maj}</div>
          <p className="text-[1.3rem] text-justify mt-0 mb-[1rem] max-sm:text-[1.5rem]" style={{ lineBreak: 'anywhere' }}>
            {preview}
          </p>
        </div>
        <div className={`flex items-center justify-center text-[1.2rem] [grid-area:year] ${text}`}>{data.year}</div>
        <div className="flex items-center [grid-area:tags]">
          <span className={`mr-[10px] text-[1.2rem] ${text}`}>{data.department}</span>
        </div>
      </div>
      <Link href={`/major/${data.id}`} onClick={() => setPendingHref(`/major/${data.id}`)} className="absolute top-0 left-0 w-full h-[75%] opacity-0">詳細內容</Link>
    </div>
  );
}
