"use client";

import { useState, useEffect } from "react";
import { AnnouncementDTO } from "@/types/api";
import { adminApiFetch } from "@/lib/api-client";

export default function AdminAnnouncementPage() {
  const [announcement, setAnnouncement] = useState<AnnouncementDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [msgNext, setMsgNext] = useState("");
  const [isShow, setIsShow] = useState(false);

  const isAnnouncementEnabled = (value: AnnouncementDTO["isShow"]) =>
    value === "1" || value === "true";

  useEffect(() => {
    adminApiFetch<AnnouncementDTO[]>("/announcements")
      .then((data: AnnouncementDTO[]) => {
        const first = Array.isArray(data) ? data[0] : null;
        if (first) {
          setAnnouncement(first);
          setMsgNext(first.msg ?? "");
          setIsShow(isAnnouncementEnabled(first.isShow));
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const updateAnnouncement = async (nextMsg: string, nextIsShow: boolean) => {
    if (!announcement) return;
    setIsSubmitting(true);
    try {
      const updated = await adminApiFetch<AnnouncementDTO>(`/announcements/${announcement.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ msg: nextMsg, isShow: nextIsShow ? "true" : "false" }),
      });
      setAnnouncement(updated);
      setMsgNext(updated.msg);
      setIsShow(isAnnouncementEnabled(updated.isShow));
      window.dispatchEvent(new CustomEvent("announcement-updated"));
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = () => updateAnnouncement(msgNext, isShow);

  const handleToggle = async () => {
    if (!announcement) return;
    const nextIsShow = !isShow;
    await updateAnnouncement(msgNext, nextIsShow);
  };

  const handlePreview = () => {
    if (!announcement) return;
    window.dispatchEvent(
      new CustomEvent<AnnouncementDTO>("announcement-preview", {
        detail: {
          ...announcement,
          msg: msgNext,
          isShow: isShow ? "true" : "false",
        },
      }),
    );
  };

  if (isLoading) {
    return (
      <div className="min-w-[350px] w-[85%] max-w-[1050px]">
        <div className="h-[150px] rounded bg-gray-100 animate-pulse mt-4" />
      </div>
    );
  }

  return (
    <div className="min-w-[350px] w-[85%] max-w-[1050px]">
      {/* Toggle row */}
      <div className="h-[50px] flex items-center gap-[10px]">
        <span className="text-[1.5rem]">彈出式公告</span>
        <button
          onClick={handleToggle}
          disabled={isSubmitting}
          className={`relative inline-flex items-center w-[70px] h-[26px] rounded-full transition-colors duration-200 disabled:opacity-50 ${
            isShow ? "bg-[var(--color-yellow)]" : "bg-gray-300"
          }`}
          aria-pressed={isShow}
        >
          <span
            className={`absolute top-[3px] w-[20px] h-[20px] bg-white rounded-full shadow transition-transform duration-200 ${
              isShow ? "translate-x-[46px]" : "translate-x-[3px]"
            }`}
          />
          <span className={`absolute text-white text-[0.75rem] font-medium transition-all duration-200 ${isShow ? "left-[8px]" : "right-[6px]"}`}>
            {isShow ? "開啟" : "關閉"}
          </span>
        </button>
      </div>

      {/* Textarea */}
      <textarea
        value={msgNext}
        disabled={!isShow || isSubmitting}
        onChange={(e) => setMsgNext(e.target.value)}
        className="min-w-[350px] h-[150px] w-full p-[10px_15px] rounded-[5px] resize-none border border-gray-200 disabled:opacity-50"
      />

      {/* Buttons */}
      <div className="flex justify-end gap-[10px] mt-[10px]">
        <button
          onClick={handleUpdate}
          disabled={isSubmitting}
          className="h-[35px] px-[15px] bg-[var(--color-yellow)] text-[var(--color-light-black)] rounded text-[1.4rem] font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          修改
        </button>
        <button
          onClick={handlePreview}
          disabled={isSubmitting || !announcement}
          className="h-[35px] px-[15px] bg-[var(--color-yellow)] text-[var(--color-light-black)] rounded text-[1.4rem] font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          預覽畫面
        </button>
      </div>
    </div>
  );
}
