"use client";

import { useTranslations } from "next-intl";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { CommentDTO } from "@/types/api";

export default function AdminMajorPage() {
  const t = useTranslations("admin.majorPage");
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<CommentDTO[]>({
    queryKey: ["comments"],
    queryFn: () => apiFetch<CommentDTO[]>("/comments"),
  });

  const confirmMutation = useMutation({
    mutationFn: (id: number) =>
      apiFetch<CommentDTO>(`/comments/${id}`, { method: "PATCH" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiFetch<void>(`/comments/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm(t("deleteConfirm"))) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-[var(--color-light-black)]">
        {t("title")}
      </h1>

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

      {data && (
        <div className="overflow-x-auto rounded-xl border border-[var(--color-dark-white)] shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-dark-white)] text-[var(--color-light-black)]">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">{t("id")}</th>
                <th className="px-4 py-3 text-left font-semibold">{t("department")}</th>
                <th className="px-4 py-3 text-left font-semibold">{t("category")}</th>
                <th className="px-4 py-3 text-left font-semibold">{t("year")}</th>
                <th className="px-4 py-3 text-left font-semibold">{t("score")}</th>
                <th className="px-4 py-3 text-left font-semibold">{t("isPass")}</th>
                <th className="px-4 py-3 text-left font-semibold">{t("confirm")}</th>
                <th className="px-4 py-3 text-left font-semibold">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-dark-white)]">
              {data.map((comment) => (
                <tr
                  key={comment.id}
                  className="bg-[var(--color-white)] hover:bg-[var(--color-dark-white)] transition-colors"
                >
                  <td className="px-4 py-3 text-[var(--color-light-black)]">
                    {comment.id}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-light-black)]">
                    {comment.department}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-light-black)]">
                    {comment.category}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-light-black)]">
                    {comment.year}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-light-black)]">
                    {comment.score}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        comment.isPass === "1" || comment.isPass === "true"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-[var(--color-red)]"
                      }`}
                    >
                      {comment.isPass === "1" || comment.isPass === "true"
                        ? t("pass")
                        : t("fail")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        comment.confirm === "1" || comment.confirm === "true"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {comment.confirm === "1" || comment.confirm === "true"
                        ? t("confirmed")
                        : t("unconfirmed")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => confirmMutation.mutate(comment.id)}
                        disabled={confirmMutation.isPending}
                        className="px-3 py-1 rounded-lg text-xs font-medium bg-[var(--color-yellow)] text-[var(--color-light-black)] hover:opacity-80 transition-opacity disabled:opacity-50"
                      >
                        {comment.confirm === "1" || comment.confirm === "true"
                          ? t("unconfirmAction")
                          : t("confirmAction")}
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        disabled={deleteMutation.isPending}
                        className="px-3 py-1 rounded-lg text-xs font-medium bg-[var(--color-red)] text-[var(--color-white)] hover:opacity-80 transition-opacity disabled:opacity-50"
                      >
                        {t("deleteAction")}
                      </button>
                    </div>
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
