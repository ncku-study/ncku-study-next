"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { AnnouncementDTO } from "@/types/api";

export default function AdminAnnouncementPage() {
  const t = useTranslations("admin.announcementPage");
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { data, isLoading, isError } = useQuery<AnnouncementDTO[]>({
    queryKey: ["announcements"],
    queryFn: () => apiFetch<AnnouncementDTO[]>("/announcements"),
  });

  const addMutation = useMutation({
    mutationFn: (body: { title: string; content: string }) =>
      apiFetch<AnnouncementDTO>("/announcements", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      setTitle("");
      setContent("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiFetch<void>(`/announcements/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm(t("deleteConfirm"))) {
      deleteMutation.mutate(id);
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    addMutation.mutate({ title, content });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-[var(--color-light-black)]">
        {t("title")}
      </h1>

      {/* Add Form */}
      <div className="mb-8 rounded-xl border border-[var(--color-dark-white)] bg-[var(--color-white)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-[var(--color-light-black)]">
          {t("addTitle")}
        </h2>
        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[var(--color-light-black)]">
              {t("titleLabel")}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("titlePlaceholder")}
              className="rounded-lg border border-[var(--color-dark-white)] px-3 py-2 text-sm text-[var(--color-light-black)] bg-[var(--color-white)] focus:outline-none focus:ring-2 focus:ring-[var(--color-yellow)]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[var(--color-light-black)]">
              {t("contentLabel")}
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t("contentPlaceholder")}
              rows={4}
              className="rounded-lg border border-[var(--color-dark-white)] px-3 py-2 text-sm text-[var(--color-light-black)] bg-[var(--color-white)] focus:outline-none focus:ring-2 focus:ring-[var(--color-yellow)] resize-none"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={addMutation.isPending}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-yellow)] text-[var(--color-light-black)] hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              {t("addSubmit")}
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-12 rounded-lg bg-[var(--color-dark-white)] animate-pulse"
            />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-[var(--color-red)]">{t("loadingError")}</p>
      )}

      {data && data.length === 0 && (
        <p className="text-[var(--color-light-black)] opacity-60">{t("noData")}</p>
      )}

      {data && data.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-[var(--color-dark-white)] shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-dark-white)] text-[var(--color-light-black)]">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">{t("id")}</th>
                <th className="px-4 py-3 text-left font-semibold">{t("msg")}</th>
                <th className="px-4 py-3 text-left font-semibold">{t("isShow")}</th>
                <th className="px-4 py-3 text-left font-semibold">{t("createdAt")}</th>
                <th className="px-4 py-3 text-left font-semibold">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-dark-white)]">
              {data.map((announcement) => (
                <tr
                  key={announcement.id}
                  className="bg-[var(--color-white)] hover:bg-[var(--color-dark-white)] transition-colors"
                >
                  <td className="px-4 py-3 text-[var(--color-light-black)]">
                    {announcement.id}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-light-black)] max-w-xs truncate">
                    {announcement.msg}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        announcement.isShow === "1" || announcement.isShow === "true"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {announcement.isShow === "1" || announcement.isShow === "true" ? "✓" : "✗"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-light-black)]">
                    {announcement.created_at ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(announcement.id)}
                      disabled={deleteMutation.isPending}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-[var(--color-red)] text-[var(--color-white)] hover:opacity-80 transition-opacity disabled:opacity-50"
                    >
                      {t("deleteAction")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
