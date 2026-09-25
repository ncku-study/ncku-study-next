"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApiFetch, apiFetch } from "@/lib/api-client";
import { CommentDTO, PaginatedResponse } from "@/types/api";
import { ALL_COMMENTS_QUERY_KEY } from "@/lib/query-keys";
import { useTranslations } from 'next-intl';
import { useClientSeo } from '@/lib/seo/use-client-seo';

const categoryColors: Record<string, { backgroundColor: string; color: string }> = {
  transfer: { backgroundColor: "bg-background-yellow", color: "text-dark-yellow" },
  minor: { backgroundColor: "bg-minor-surface", color: "text-dark-black" },
  double: { backgroundColor: "bg-light-black", color: "text-white" },
};
const defaultIconStyle = { backgroundColor: "bg-background-yellow", color: "text-dark-yellow" };

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
    <div className="w-full flex flex-col py-8 px-2 flex-1">
      {/* TitleBar */}
      <div className="flex items-center">
        <div
          className={`flex justify-center items-center font-semibold rounded-full my-4 mx-auto scale-110 ${iconStyle.backgroundColor} ${iconStyle.color}`}
          style={{ width: '42px', height: '42px' }}
        >
          {comment.category?.[0] ?? categoryLabels.transfer[0]}
        </div>
        <div className="ml-4 flex-1">
          <h4 className="m-0 text-[1.9rem] mb-2">{comment.in_maj}</h4>
          <p className="text-[1.3rem] text-card-text m-0">
            {tMajor('originalMajor')}: {comment.out_maj}
          </p>
        </div>
      </div>

      {/* DetailList */}
      <div className="flex flex-wrap my-8 mx-0">
        {tags.map(({ type, value }) => {
          const isFailResult = type === tMajor('applicationResult') && (value === "false" || value === categoryLabels.fail);
          const displayValue = type === tMajor('applicationResult') ? isPassDisplay(value, categoryLabels.pass, categoryLabels.fail) : value;
          return (
            <div
              key={type}
              className={`min-w-30 h-20 p-2 bg-white ${isFailResult ? 'text-red' : 'text-card-text'}`}
            >
              <div className="text-[1.4rem]">{type}</div>
              <div className="text-[1.7rem] font-bold">{displayValue}</div>
            </div>
          );
        })}
      </div>

      {/* ReaderText */}
      <div className="overflow-y-auto break-anywhere text-justify whitespace-pre-line text-[17px] custom-scrollbar" style={{ lineHeight: '2.8rem', letterSpacing: '2.5px' }}>
        {comment.comment.replace(/<br\s*\/?>/gi, '\n')}
      </div>
    </div>
  );
}
