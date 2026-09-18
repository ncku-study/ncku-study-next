"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import type { AnnouncementDTO } from "@/types/api";
import { adminApiFetch, apiFetch } from "@/lib/api-client";

const READ_STORAGE_KEY = "announcementUpdateAt";

type ReadAnnouncement = {
  data?: Array<Pick<AnnouncementDTO, "id" | "updated_at">>;
};

function isAnnouncementEnabled(value: AnnouncementDTO["isShow"]): boolean {
  return value === "true" || value === "1";
}

function hasReadAnnouncement(announcement: AnnouncementDTO): boolean {
  const storedValue = window.localStorage.getItem(READ_STORAGE_KEY);
  if (!storedValue) return false;

  try {
    const stored = JSON.parse(storedValue) as ReadAnnouncement;
    const readAnnouncement = stored.data?.[0];
    if (!readAnnouncement || readAnnouncement.id !== announcement.id) {
      return false;
    }

    if (readAnnouncement.updated_at === announcement.updated_at) {
      return true;
    }

    if (!readAnnouncement.updated_at || !announcement.updated_at) {
      return false;
    }

    const currentTimestamp = Date.parse(announcement.updated_at);
    const readTimestamp = Date.parse(readAnnouncement.updated_at);
    return Number.isFinite(currentTimestamp) &&
      Number.isFinite(readTimestamp) &&
      currentTimestamp <= readTimestamp;
  } catch {
    return false;
  }
}

function rememberReadAnnouncement(announcement: AnnouncementDTO): void {
  window.localStorage.setItem(
    READ_STORAGE_KEY,
    JSON.stringify({
      data: [{ id: announcement.id, updated_at: announcement.updated_at }],
    }),
  );
}

export default function AnnouncementNotification() {
  const pathname = usePathname();
  const t = useTranslations("common");
  const [announcement, setAnnouncement] = useState<AnnouncementDTO | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const loadAnnouncement = useCallback(async () => {
    try {
      const data = pathname.startsWith("/admin")
        ? await adminApiFetch<AnnouncementDTO[]>("/announcements")
        : await apiFetch<AnnouncementDTO[]>("/announcements");
      const first = Array.isArray(data) ? (data[0] as AnnouncementDTO | undefined) : undefined;
      if (!first) {
        setAnnouncement(null);
        setIsVisible(false);
        return;
      }

      setAnnouncement(first);
      setIsVisible(
        isAnnouncementEnabled(first.isShow) &&
          first.msg.trim().length > 0 &&
          !hasReadAnnouncement(first),
      );
    } catch {
      // The notification is optional UI and should not interrupt page rendering.
    }
  }, [pathname]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadAnnouncement();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadAnnouncement, pathname]);

  useEffect(() => {
    const handleAnnouncementUpdated = () => {
      void loadAnnouncement();
    };

    const handleAnnouncementPreview = (event: Event) => {
      const preview = (event as CustomEvent<AnnouncementDTO>).detail;
      if (!preview) return;
      setAnnouncement(preview);
      setIsVisible(preview.msg.trim().length > 0);
    };

    window.addEventListener("announcement-updated", handleAnnouncementUpdated);
    window.addEventListener("announcement-preview", handleAnnouncementPreview);
    return () => {
      window.removeEventListener("announcement-updated", handleAnnouncementUpdated);
      window.removeEventListener("announcement-preview", handleAnnouncementPreview);
    };
  }, [loadAnnouncement]);

  const handleClose = () => {
    if (announcement) rememberReadAnnouncement(announcement);
    setIsVisible(false);
  };

  if (!isVisible || !announcement) return null;

  return (
    <div
      role="alert"
      className="fixed left-1/2 top-10 z-50 flex w-1/2 max-w-full -translate-x-1/2 items-center rounded border-x border-transparent bg-snackbar px-6 py-2.5 text-[0.875rem] text-white shadow-xl max-sm:w-149 max-sm:border-x-0 max-sm:top-3 lg:-translate-y-px"
      style={{ fontFamily: 'Roboto, Helvetica, Arial, sans-serif', lineHeight: 1.43, boxShadow: 'var(--shadow-snackbar)' }}
    >
      <p
        className="m-0 hidden min-w-0 flex-1 -translate-y-px py-3 text-justify text-[15px] sm:block lg:translate-y-0"
        style={{ letterSpacing: '0.09px', lineHeight: 1.43, position: 'relative', top: '0.25px' }}
      >
        {announcement.msg}
      </p>
      <p
        className="m-0 block min-w-0 flex-1 translate-y-px py-3 text-justify text-[15.005px] sm:hidden"
        style={{ letterSpacing: '0.0937125px', lineHeight: 1.43, position: 'relative', left: '0.25px', top: '-0.25px' }}
      >
        {announcement.msg}
      </p>
      <div className="ml-8 -mr-3 hidden -translate-y-px items-center pl-5 sm:flex lg:translate-y-0" style={{ position: 'relative', left: '0.5px', top: '0.25px' }}>
        <button
          type="button"
          onClick={handleClose}
          className="h-16 shrink-0 rounded-full border-0 bg-white px-4 py-2 text-[0.875rem] text-white hover:bg-white"
          style={{ letterSpacing: '0.0937125px' }}
        >
          {t("acknowledge")}
        </button>
      </div>
      <div className="ml-8 -mr-3 flex translate-y-px items-center pl-5 sm:hidden" style={{ position: 'relative', left: '0.25px', top: '-0.25px' }}>
        <button
          type="button"
          onClick={handleClose}
          className="h-16 shrink-0 rounded-full border-0 bg-white px-4 py-2 text-[0.875rem] text-white hover:bg-white"
          style={{ letterSpacing: '0.125px' }}
        >
          {t("acknowledge")}
        </button>
      </div>
    </div>
  );
}
