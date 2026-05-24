"use client";

import { useTranslations } from "next-intl";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { StudyDTO } from "@/types/api";

export default function AdminStudyPage() {
  const t = useTranslations("admin.studyPage");
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<StudyDTO[]>({
    queryKey: ["studies"],
    queryFn: () => apiFetch<StudyDTO[]>("/studies"),
  });

  const confirmMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch<StudyDTO>(`/studies/${id}`, { method: "PATCH" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studies"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/studies/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studies"] });
    },
  });

  const handleDelete = (id: string) => {
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
                <th className="px-4 py-3 text-left font-semibold">{t("studyTitle")}</th>
                <th className="px-4 py-3 text-left font-semibold">{t("category")}</th>
                <th className="px-4 py-3 text-left font-semibold">{t("year")}</th>
                <th className="px-4 py-3 text-left font-semibold">{t("confirm")}</th>
                <th className="px-4 py-3 text-left font-semibold">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-dark-white)]">
              {data.map((study) => (
                <tr
                  key={study.id}
                  className="bg-[var(--color-white)] hover:bg-[var(--color-dark-white)] transition-colors"
                >
                  <td className="px-4 py-3 text-[var(--color-light-black)]">
                    {study.id}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-light-black)]">
                    {study.title}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-light-black)]">
                    {study.category.map((c) => c.name).join(", ")}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-light-black)]">
                    {study.year}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        study.confirm === "1" || study.confirm === "true"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {study.confirm === "1" || study.confirm === "true"
                        ? t("confirmed")
                        : t("unconfirmed")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => confirmMutation.mutate(study.id)}
                        disabled={confirmMutation.isPending}
                        className="px-3 py-1 rounded-lg text-xs font-medium bg-[var(--color-yellow)] text-[var(--color-light-black)] hover:opacity-80 transition-opacity disabled:opacity-50"
                      >
                        {study.confirm === "1" || study.confirm === "true"
                          ? t("unconfirmAction")
                          : t("confirmAction")}
                      </button>
                      <button
                        onClick={() => handleDelete(study.id)}
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
