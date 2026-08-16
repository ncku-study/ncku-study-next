"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApiFetch, apiFetch } from "@/lib/api-client";
import { CommentDTO, PaginatedResponse } from "@/types/api";
import { ALL_COMMENTS_QUERY_KEY } from "@/lib/query-keys";
import { useTranslations } from 'next-intl';
import { useClientSeo } from '@/lib/seo/use-client-seo';

const categoryColors: Record<string, { backgroundColor: string; color: string }> = {
  transfer: { backgroundColor: "rgba(254, 218, 106, 0.4)", color: "rgba(225, 175, 19, 1)" },
  minor: { backgroundColor: "rgba(29, 30, 34, 0.2)", color: "rgba(29, 30, 34, 1)" },
  double: { backgroundColor: "#393F4D", color: "#FFFFFF" },
};
const defaultIconStyle = { backgroundColor: "rgba(254, 218, 106, 0.4)", color: "rgba(225, 175, 19, 1)" };

function getCategoryStyle(category: string, labels: { transfer: string; minor: string; double: string }) {
  if (category === labels.transfer) return categoryColors.transfer;
  if (category === labels.minor) return categoryColors.minor;
  if (category === labels.double) return categoryColors.double;
  return defaultIconStyle;
}

function isPassDisplay(value: string, passLabel: string, failLabel: string): string {
  if (value === "false" || value === failLabel) return failLabel;
  return passLabel;
}

interface Props {
  id: number;
  serverComment?: CommentDTO;
  isAdmin?: boolean;
}

export default function ModalContent({ id, serverComment, isAdmin = false }: Props) {
  const t = useTranslations('site');
  const tMajor = useTranslations('major');
  const queryClient = useQueryClient();
  const cachedComment = isAdmin ? undefined : queryClient
    .getQueryData<PaginatedResponse<CommentDTO>>(ALL_COMMENTS_QUERY_KEY)
    ?.data.find((c) => c.id === id);
  const initialComment = cachedComment ?? serverComment;

  const { data: fetchedComment } = useQuery({
    queryKey: isAdmin ? ["admin-comment", id] : ["comment", id],
    queryFn: () => isAdmin
      ? adminApiFetch<CommentDTO>(`/comments/${id}`)
      : apiFetch<CommentDTO>(`/comments/${id}`),
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

  const categoryLabels = {
    transfer: tMajor('categoryTransfer'),
    minor: tMajor('categoryMinor'),
    double: tMajor('categoryDouble'),
    pass: tMajor('pass'),
    fail: tMajor('fail'),
  };
  const iconStyle = getCategoryStyle(comment.category, categoryLabels);

  const tags = [
    { type: tMajor('applicationYear'), value: String(comment.year) },
    { type: tMajor('academicScore'), value: String(comment.score) },
    { type: tMajor('applicationResult'), value: comment.isPass },
    { type: tMajor('ranking'), value: `${comment.rank_1} / ${comment.rank_2}` },
  ];

  return (
    <div className="w-full flex flex-col py-[20px] px-[5px]">
      {/* TitleBar */}
      <div className="flex items-center">
        <div
          className="flex justify-center items-center font-semibold w-[42px] h-[42px] rounded-[42px] my-[10px] mx-auto scale-110"
          style={iconStyle}
        >
          {comment.category?.[0] ?? categoryLabels.transfer[0]}
        </div>
        <div className="ml-[10px] flex-1">
          <h4 className="m-0 text-[1.9rem] mb-[5px]">{comment.in_maj}</h4>
          <p className="text-[1.3rem] m-0" style={{ color: "rgba(163,158,158,1)" }}>
            {tMajor('originalMajor')}: {comment.out_maj}
          </p>
        </div>
      </div>

      {/* DetailList */}
      <div className="flex flex-wrap my-[20px] mx-0">
        {tags.map(({ type, value }) => {
          const isFailResult = type === tMajor('applicationResult') && (value === "false" || value === categoryLabels.fail);
          const displayValue = type === tMajor('applicationResult') ? isPassDisplay(value, categoryLabels.pass, categoryLabels.fail) : value;
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
