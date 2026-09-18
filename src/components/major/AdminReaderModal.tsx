"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { CommentDTO } from "@/types/api";
import { ALL_COMMENTS_QUERY_KEY } from "@/lib/query-keys";
import { adminApiFetch } from "@/lib/api-client";

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

function ChangeArrow({ direction, visible, onClick }: { direction: "left" | "right"; visible: boolean; onClick: () => void }) {
  return (
    <div
      className={`w-20 flex-none flex justify-center items-center ${visible ? "cursor-pointer" : "invisible"}`}
      onClick={visible ? onClick : undefined}
    >
      <div
        className="border-r-2 border-t-2 border-arrow h-12 w-12 border-l border-b border-l-transparent border-b-transparent inline-block rotate-45"
        style={direction === "left" ? { transform: 'rotate(225deg)' } : undefined}
      />
    </div>
  );
}

interface Props {
  comment: CommentDTO;
  allComments: CommentDTO[];
  onClose: () => void;
  onNavigate: (comment: CommentDTO) => void;
}

export default function AdminReaderModal({ comment, allComments, onClose, onNavigate }: Props) {
  const tMajor = useTranslations("major");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);
  const [localConfirm, setLocalConfirm] = useState(comment.confirm === "true");
  const [waitDelete, setWaitDelete] = useState(false);

  // sync when card changes
  useEffect(() => {
    setLocalConfirm(comment.confirm === "true");
    setWaitDelete(false);
  }, [comment.id, comment.confirm]);

  const currentIndex = allComments.findIndex((c) => c.id === comment.id);
  const prevComment = currentIndex > 0 ? allComments[currentIndex - 1] : null;
  const nextComment = currentIndex >= 0 && currentIndex < allComments.length - 1 ? allComments[currentIndex + 1] : null;

  const handleToggle = async () => {
    const next = !localConfirm;
    setLocalConfirm(next);
    setIsPending(true);
    try {
      await adminApiFetch(`/comments/${comment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: next ? "true" : "false" }),
      });
      queryClient.invalidateQueries({ queryKey: ["admin-comments"] });
      queryClient.invalidateQueries({ queryKey: ALL_COMMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async () => {
    setIsPending(true);
    try {
      await adminApiFetch(`/comments/${comment.id}`, { method: "DELETE" });
      queryClient.invalidateQueries({ queryKey: ["admin-comments"] });
      queryClient.invalidateQueries({ queryKey: ALL_COMMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      onClose();
    } finally {
      setIsPending(false);
    }
  };

  const handleEdit = () => {
    onClose();
    router.push(`/admin/post?type=major&id=${comment.id}`);
  };

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && prevComment) onNavigate(prevComment);
      if (e.key === "ArrowRight" && nextComment) onNavigate(nextComment);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, prevComment, nextComment, onNavigate]);

  const categoryLabels = {
    transfer: tMajor("categoryTransfer"),
    minor: tMajor("categoryMinor"),
    double: tMajor("categoryDouble"),
    pass: tMajor("pass"),
    fail: tMajor("fail"),
  };
  const iconStyle = getCategoryStyle(comment.category, categoryLabels);

  const tags = [
    { type: tMajor("applicationYear"), value: String(comment.year) },
    { type: tMajor("academicScore"), value: String(comment.score) },
    { type: tMajor("applicationResult"), value: comment.isPass },
    { type: tMajor("ranking"), value: `${comment.rank_1} / ${comment.rank_2}` },
  ];

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay"
      onClick={onClose}
    >
      {/* Modal container — stop propagation so clicks inside don't close */}
      <div
        className="relative flex w-240 h-4/5 max-h-4/5 p-2 bg-white text-card-text max-lg:w-144 max-lg:min-w-full max-lg:h-2/3"
        onClick={(e) => e.stopPropagation()}
      >
        <ChangeArrow direction="left" visible={!!prevComment} onClick={() => prevComment && onNavigate(prevComment)} />

        {/* Content */}
        <div className="w-full flex flex-1 flex-col py-8 px-2 overflow-hidden">
          {/* TitleBar */}
          <div className="flex items-center shrink-0">
            <div
              className={`flex justify-center items-center font-semibold w-17 h-17 rounded-full my-4 mx-auto scale-110 ${iconStyle.backgroundColor} ${iconStyle.color}`}
            >
              {comment.category?.[0] ?? categoryLabels.transfer[0]}
            </div>
            <div className="ml-4 flex-1">
              <h4 className="m-0 text-[1.9rem] mb-2">{comment.in_maj}</h4>
              <p className="text-[1.3rem] text-dark-gray m-0">
                {tMajor("originalMajor")} {comment.out_maj}
              </p>
            </div>
          </div>

          {/* Confirm toggle (admin only) */}
          <div className="flex items-center gap-2.5 shrink-0 mt-2">
            <span className="text-[1.4rem]">{tMajor("reviewed")}</span>
            <button
              onClick={handleToggle}
              disabled={isPending}
              className={`relative inline-flex items-center w-22 h-10 rounded-full transition-colors duration-200 disabled:opacity-50 ${
                localConfirm ? "bg-yellow" : "bg-toggle-off"
              }`}
              aria-pressed={localConfirm}
            >
              <span
                className={`absolute top-1 w-8 h-8 bg-white rounded-full shadow transition-transform duration-200 ${
                  localConfirm ? "translate-x-12" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* DetailList */}
          <div className="flex flex-wrap my-8 mx-0 shrink-0">
            {tags.map(({ type, value }) => {
              const isFailResult = type === tMajor("applicationResult") && (value === "false" || value === categoryLabels.fail);
              const displayValue = type === tMajor("applicationResult") ? isPassDisplay(value, categoryLabels.pass, categoryLabels.fail) : value;
              return (
                <div
                  key={type}
                  className={`min-w-30 h-20 p-2 bg-white ${isFailResult ? 'text-red' : 'text-dark-black'}`}
                >
                  <div className="text-[1.4rem]">{type}</div>
                  <div className="text-[1.7rem] font-bold">{displayValue}</div>
                </div>
              );
            })}
          </div>

          {/* ReaderText */}
          <div className="overflow-y-auto break-anywhere text-justify whitespace-pre-line text-[17px] custom-scrollbar" style={{ lineHeight: '2.8rem', letterSpacing: '2.5px' }}>
            {comment.comment.replace(/<br\s*\/?>/gi, "\n")}
          </div>

          {/* AdvanceAdmin — matches vite AdvanceAdmin layout */}
          <div className="mt-20 h-20 shrink-0 flex items-center justify-end gap-2.5">
            {!waitDelete ? (
              <>
                <button
                  disabled={isPending}
                  onClick={() => setWaitDelete(true)}
                  className="h-16 w-48 bg-white border-2 border-yellow text-light-black cursor-pointer hover:brightness-75 disabled:opacity-50"
                >
                  {tCommon("deleteStudy")}
                </button>
                <button
                  disabled={isPending}
                  onClick={handleEdit}
                  className="h-16 w-44 bg-yellow text-light-black cursor-pointer hover:brightness-75 disabled:opacity-50"
                >
                  {tCommon("edit")}
                </button>
              </>
            ) : (
              <>
                <button
                  disabled={isPending}
                  onClick={handleDelete}
                  className="h-16 w-48 bg-white border-2 border-yellow text-light-black cursor-pointer hover:brightness-75 disabled:opacity-50"
                >
                  {tCommon("confirmDelete")}
                </button>
                <p className="font-bold m-4 text-sm">{tCommon("confirmDeleteStudy")}</p>
                <button
                  disabled={isPending}
                  onClick={() => setWaitDelete(false)}
                  className="h-16 w-44 bg-yellow text-light-black cursor-pointer hover:brightness-75 disabled:opacity-50"
                >
                  {tCommon("cancel")}
                </button>
              </>
            )}
          </div>
        </div>

        <ChangeArrow direction="right" visible={!!nextComment} onClick={() => nextComment && onNavigate(nextComment)} />
      </div>
    </div>
  );
}
