import React from 'react';
import Link from 'next/link';
import { CommentDTO } from '@/types/api';

interface TransCardProps {
  data: CommentDTO;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function TransCard({ data }: TransCardProps) {
  const plainComment = stripHtml(data.comment);
  const commentPreview = plainComment.length > 27 
    ? plainComment.substring(0, 26) + '  (...)' 
    : plainComment;

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case '轉系':
        return { bg: 'bg-background-yellow', text: 'text-dark-yellow' };
      case '輔系':
        return { bg: 'bg-dark-black/20', text: 'text-dark-black' };
      case '雙主修':
      default:
        return { bg: 'bg-light-black', text: 'text-white' };
    }
  };

  const { bg: iconBg, text: iconText } = getCategoryStyles(data.category);

  return (
    <div className={`relative border border-black/[0.125] p-[5px] text-black rounded-[15px] h-[180px] w-[220px] max-sm:border-x-0 max-sm:border-t-0 max-sm:w-full max-sm:rounded-none max-sm:h-[145px] ${data.confirm === 'false' ? 'bg-lightYellow' : 'bg-white'}`}>
      <div className="grid grid-cols-[57px_auto] grid-rows-[auto_30px] [grid-template-areas:'icon_main'_'year_tags'] w-[210px] h-[160px] px-[10px] pt-[5px] pb-0 max-sm:w-full max-sm:h-[125px]">
        
        {/* TypeIcon */}
        <div style={{ gridArea: 'icon' }} className={`w-[42px] h-[42px] rounded-[42px] my-[10px] mx-auto flex items-center justify-center text-[1.4rem] font-semibold ${iconBg} ${iconText}`}>
          {data.category.charAt(0)}
        </div>

        {/* ContentInfo */}
        <div style={{ gridArea: 'main' }} className="grid grid-rows-[35px_25px_auto]">
          <h4 className="text-[1.8rem] mt-[10px] mb-[10px] leading-[1.1] m-0 font-medium">
            {data.in_maj}
          </h4>
          <div className="text-dark-gray text-[1.2rem]">
            原主修 {data.out_maj}
          </div>
          <p className="text-[1.3rem] text-justify mt-0 mb-[1rem] leading-normal" style={{ wordBreak: 'break-all', lineBreak: 'anywhere' }}>
            {commentPreview}
          </p>
        </div>

        {/* YearSpan */}
        <div style={{ gridArea: 'year' }} className={`flex items-center justify-center text-[1.2rem] ${iconText}`}>
          {data.year}
        </div>

        {/* TagSpanList */}
        <div style={{ gridArea: 'tags' }} className="flex items-center">
          <span className={`mr-[10px] text-[1.2rem] ${iconText}`}>
            {data.department}
          </span>
        </div>
      </div>
      
      {/* ShowBtn */}
      <Link href={`/major/${data.id}`} className="absolute top-0 left-0 w-full h-[75%] opacity-0">
        詳細內容
      </Link>
    </div>
  );
}
