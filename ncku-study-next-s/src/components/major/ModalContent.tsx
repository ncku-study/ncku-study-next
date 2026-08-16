"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { CommentDTO, PaginatedResponse } from "@/types/api";
import { ALL_COMMENTS_QUERY_KEY } from "@/lib/query-keys";
import { useTranslations } from 'next-intl';
import { useClientSeo } from '@/lib/seo/use-client-seo';

const colorMap: Record<string, { backgroundColor: string; color: string }> = {
  轉系: { backgroundColor: "rgba(254, 218, 106, 0.4)", color: "rgba(225, 175, 19, 1)" },
  輔系: { backgroundColor: "rgba(29, 30, 34, 0.2)", color: "rgba(29, 30, 34, 1)" },
  雙主修: { backgroundColor: "#393F4D", color: "#FFFFFF" },
};
const defaultIconStyle = { backgroundColor: "rgba(254, 218, 106, 0.4)", color: "rgba(225, 175, 19, 1)" };

function isPassDisplay(value: string): string {
  if (value === "false" || value === "未通過") return "未通過";
  return "通過";
}

interface Props {
  id: number;
  serverComment?: CommentDTO;
  isAdmin?: boolean;
}

export default function ModalContent({ id, serverComment, isAdmin = false }: Props) {
  const t = useTranslations('site');
  const queryClient = useQueryClient();
  const cachedComment = isAdmin ? undefined : queryClient
    .getQueryData<PaginatedResponse<CommentDTO>>(ALL_COMMENTS_QUERY_KEY)
    ?.data.find((c) => c.id === id);
  const initialComment = cachedComment ?? serverComment;

  const { data: fetchedComment } = useQuery({
    queryKey: isAdmin ? ["admin-comment", id] : ["comment", id],
    queryFn: () => apiFetch<CommentDTO>(`/comments/${id}`),
    initialData: isAdmin ? undefined : initialComment,
    // A client-side major navigation must use the hydrated list. Direct URL
    // requests provide serverComment; neither path needs another detail fetch.
    enabled: !isAdmin && Boolean(initialComment),
    staleTime: isAdmin ? 0 : 60_000,
    gcTime: isAdmin ? 0 : 60_000,
  });
  const comment = isAdmin ? serverComment : fetchedComment;

  useClientSeo({
    baseline: {
      title: t('title'),
      description: t('description'),
      pathname: '/major',
      openGraphType: 'website',
    },
    detail: comment
      ? {
          title: t('majorDetailTitle', {
            year: comment.year,
            inMaj: comment.in_maj,
            category: comment.category,
          }),
          description: comment.comment,
          pathname: `/major/${encodeURIComponent(String(id))}`,
          openGraphType: 'article',
        }
      : undefined,
  });

  if (!comment) return null;

  const iconStyle = colorMap[comment.category] ?? defaultIconStyle;

  const tags = [
    { type: "申請年度", value: String(comment.year) },
    { type: "學年分數", value: String(comment.score) },
    { type: "申請結果", value: comment.isPass },
    { type: "排名(上/下)", value: `${comment.rank_1} / ${comment.rank_2}` },
  ];

  return (
    <div className="w-full flex flex-col py-[20px] px-[5px]">
      {/* TitleBar */}
      <div className="flex items-center">
        <div
          className="flex justify-center items-center font-semibold w-[42px] h-[42px] rounded-[42px] my-[10px] mx-auto scale-110"
          style={iconStyle}
        >
          {comment.category?.[0] ?? "轉"}
        </div>
        <div className="ml-[10px] flex-1">
          <h4 className="m-0 text-[1.9rem] mb-[5px]">{comment.in_maj}</h4>
          <p className="text-[1.3rem] m-0" style={{ color: "rgba(163,158,158,1)" }}>
            原主修: {comment.out_maj}
          </p>
        </div>
      </div>

      {/* DetailList */}
      <div className="flex flex-wrap my-[20px] mx-0">
        {tags.map(({ type, value }) => {
          const isFailResult = type === "申請結果" && (value === "false" || value === "未通過");
          const displayValue = type === "申請結果" ? isPassDisplay(value) : value;
          return (
            <div
              key={type}
              className="min-w-[75px] h-[50px] p-[5px] bg-white"
              style={{ color: isFailResult ? "rgba(245,88,123,1)" : "rgba(29,30,34,1)" }}
            >
              <div className="text-[1.4rem]">{type}</div>
              <div className="text-[1.7rem] font-bold">{displayValue}</div>
            </div>
          );
        })}
      </div>

      {/* ReaderText */}
      <div className="leading-[2.8rem] tracking-[2.5px] overflow-y-auto break-anywhere text-justify whitespace-pre-line text-[17px] [&::-webkit-scrollbar]:w-[1px] [&::-webkit-scrollbar]:h-[1px] [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar]:border-none [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-[#555] [&::-webkit-scrollbar-thumb]:opacity-50 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:border-0">
        {comment.comment.replace(/<br\s*\/?>/gi, '\n')}
      </div>
    </div>
  );
}
