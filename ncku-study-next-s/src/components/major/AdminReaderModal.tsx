"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { CommentDTO } from "@/types/api";
import { ALL_COMMENTS_QUERY_KEY } from "@/lib/query-keys";

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

function ChangeArrow({ direction, visible, onClick }: { direction: "left" | "right"; visible: boolean; onClick: () => void }) {
  return (
    <div
      className={`flex justify-center items-center ${visible ? "cursor-pointer" : "invisible"}`}
      onClick={visible ? onClick : undefined}
    >
      <div
        className={`border-r-2 border-t-2 border-gray-500 h-[30px] w-[30px] border-l border-b border-l-transparent border-b-transparent inline-block ${
          direction === "left" ? "rotate-[225deg]" : "rotate-45"
        }`}
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
      await fetch(`/api/v2/comments/${comment.id}`, {
        method: "PUT",
        cache: "no-store",
        headers: { "Content-Type": "application/json", "x-api-cache": "no-store" },
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
      await fetch(`/api/v2/comments/${comment.id}`, { method: "DELETE", cache: "no-store", headers: { "x-api-cache": "no-store" } });
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

  const iconStyle = colorMap[comment.category] ?? defaultIconStyle;

  const tags = [
    { type: "申請年度", value: String(comment.year) },
    { type: "學年分數", value: String(comment.score) },
    { type: "申請結果", value: comment.isPass },
    { type: "排名(上/下)", value: `${comment.rank_1} / ${comment.rank_2}` },
  ];

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      {/* Modal container — stop propagation so clicks inside don't close */}
      <div
        className="relative w-[600px] h-[80vh] max-h-[80vh] p-[5px] bg-white text-black grid grid-cols-[50px_auto_50px] grid-rows-[100%] max-lg:w-[360px] max-lg:min-w-[95vw] max-lg:h-[65vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <ChangeArrow direction="left" visible={!!prevComment} onClick={() => prevComment && onNavigate(prevComment)} />

        {/* Content */}
        <div className="w-full flex flex-col py-[20px] px-[5px] overflow-hidden">
          {/* TitleBar */}
          <div className="flex items-center shrink-0">
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

          {/* Confirm toggle (admin only) */}
          <div className="flex items-center gap-[10px] shrink-0 mt-[8px]">
            <span className="text-[1.4rem]">是否已審查</span>
            <button
              onClick={handleToggle}
              disabled={isPending}
              className={`relative inline-flex items-center w-[54px] h-[26px] rounded-full transition-colors duration-200 disabled:opacity-50 ${
                localConfirm ? "bg-[var(--color-yellow)]" : "bg-gray-300"
              }`}
              aria-pressed={localConfirm}
            >
              <span
                className={`absolute top-[3px] w-[20px] h-[20px] bg-white rounded-full shadow transition-transform duration-200 ${
                  localConfirm ? "translate-x-[30px]" : "translate-x-[3px]"
                }`}
              />
            </button>
          </div>

          {/* DetailList */}
          <div className="flex flex-wrap my-[20px] mx-0 shrink-0">
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
            {comment.comment.replace(/<br\s*\/?>/gi, "\n")}
          </div>

          {/* AdvanceAdmin — matches vite AdvanceAdmin layout */}
          <div className="mt-[50px] h-[50px] shrink-0 flex items-center justify-end gap-[6px]">
            {!waitDelete ? (
              <>
                <button
                  disabled={isPending}
                  onClick={() => setWaitDelete(true)}
                  className="h-[40px] w-[120px] bg-white border-2 border-[var(--color-yellow)] text-[var(--color-light-black)] cursor-pointer hover:brightness-75 disabled:opacity-50"
                >
                  {"\u522a\u9664\u6b64\u5fc3\u5f97"}
                </button>
                <button
                  disabled={isPending}
                  onClick={handleEdit}
                  className="h-[40px] w-[110px] bg-[var(--color-yellow)] text-[var(--color-light-black)] cursor-pointer hover:brightness-75 disabled:opacity-50"
                >
                  {"\u7de8\u8f2f"}
                </button>
              </>
            ) : (
              <>
                <button
                  disabled={isPending}
                  onClick={handleDelete}
                  className="h-[40px] w-[120px] bg-white border-2 border-[var(--color-yellow)] text-[var(--color-light-black)] cursor-pointer hover:brightness-75 disabled:opacity-50"
                >
                  {"\u78ba\u8a8d\u522a\u9664"}
                </button>
                <p className="font-bold m-[10px] text-sm">{"\u771f\u7684\u8981\u522a\u9664\u9019\u500b\u5fc3\u5f97\u55ce?"}</p>
                <button
                  disabled={isPending}
                  onClick={() => setWaitDelete(false)}
                  className="h-[40px] w-[110px] bg-[var(--color-yellow)] text-[var(--color-light-black)] cursor-pointer hover:brightness-75 disabled:opacity-50"
                >
                  {"\u53d6\u6d88"}
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
