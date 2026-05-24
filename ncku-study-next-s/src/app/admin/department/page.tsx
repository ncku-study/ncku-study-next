"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { DepartmentDTO, CollegeDTO, CategoryDTO } from "@/types/api";

type Tab = "departments" | "colleges" | "categories";

function EntitySection<T extends { id: number | string; name: string }>({
  titleKey,
  addLabelKey,
  items,
  isLoading,
  isError,
  onDelete,
  onAdd,
  isPendingDelete,
  isPendingAdd,
  renderExtra,
  t,
}: {
  titleKey: string;
  addLabelKey: string;
  items: T[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onDelete: (id: number | string) => void;
  onAdd: (name: string) => void;
  isPendingDelete: boolean;
  isPendingAdd: boolean;
  renderExtra?: (item: T) => React.ReactNode;
  t: ReturnType<typeof useTranslations>;
}) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim());
    setName("");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-[var(--color-light-black)]">
        {t(titleKey)}
      </h2>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-10 rounded-lg bg-[var(--color-dark-white)] animate-pulse"
            />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-[var(--color-red)] text-sm">{t("loadingError")}</p>
      )}

      {items && items.length === 0 && (
        <p className="text-sm text-gray-400">{t("noData")}</p>
      )}

      {items && items.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-[var(--color-dark-white)] shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-dark-white)] text-[var(--color-light-black)]">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">{t("id")}</th>
                <th className="px-4 py-3 text-left font-semibold">{t("name")}</th>
                {renderExtra && (
                  <th className="px-4 py-3 text-left font-semibold">{t("college")}</th>
                )}
                <th className="px-4 py-3 text-left font-semibold">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-dark-white)]">
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="bg-[var(--color-white)] hover:bg-[var(--color-dark-white)] transition-colors"
                >
                  <td className="px-4 py-3 text-[var(--color-light-black)]">{item.id}</td>
                  <td className="px-4 py-3 text-[var(--color-light-black)]">{item.name}</td>
                  {renderExtra && (
                    <td className="px-4 py-3 text-[var(--color-light-black)]">
                      {renderExtra(item)}
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onDelete(item.id)}
                      disabled={isPendingDelete}
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

      <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("namePlaceholder")}
          className="flex-1 px-3 py-2 rounded-lg border border-[var(--color-dark-white)] bg-[var(--color-white)] text-[var(--color-light-black)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-yellow)]"
        />
        <button
          type="submit"
          disabled={isPendingAdd || !name.trim()}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-yellow)] text-[var(--color-light-black)] hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          {t("addSubmit")}
        </button>
      </form>
    </div>
  );
}

export default function AdminDepartmentPage() {
  const t = useTranslations("admin.departmentPage");
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>("departments");

  // Departments
  const departments = useQuery<DepartmentDTO[]>({
    queryKey: ["departments"],
    queryFn: () => apiFetch<DepartmentDTO[]>("/departments"),
  });

  const addDepartment = useMutation({
    mutationFn: (name: string) =>
      apiFetch<DepartmentDTO>("/departments", {
        method: "POST",
        body: JSON.stringify({ name }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["departments"] }),
  });

  const deleteDepartment = useMutation({
    mutationFn: (id: number | string) =>
      apiFetch<void>(`/departments/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["departments"] }),
  });

  // Colleges
  const colleges = useQuery<CollegeDTO[]>({
    queryKey: ["colleges"],
    queryFn: () => apiFetch<CollegeDTO[]>("/colleges"),
  });

  const addCollege = useMutation({
    mutationFn: (name: string) =>
      apiFetch<CollegeDTO>("/colleges", {
        method: "POST",
        body: JSON.stringify({ name }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["colleges"] }),
  });

  const deleteCollege = useMutation({
    mutationFn: (id: number | string) =>
      apiFetch<void>(`/colleges/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["colleges"] }),
  });

  // Categories
  const categories = useQuery<CategoryDTO[]>({
    queryKey: ["categories"],
    queryFn: () => apiFetch<CategoryDTO[]>("/categories"),
  });

  const addCategory = useMutation({
    mutationFn: (name: string) =>
      apiFetch<CategoryDTO>("/categories", {
        method: "POST",
        body: JSON.stringify({ name }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

  const deleteCategory = useMutation({
    mutationFn: (id: number | string) =>
      apiFetch<void>(`/categories/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

  const handleDelete = (
    id: number | string,
    mutate: (id: number | string) => void
  ) => {
    if (window.confirm(t("deleteConfirm"))) {
      mutate(id);
    }
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "departments", label: t("departmentsTab") },
    { key: "colleges", label: t("collegesTab") },
    { key: "categories", label: t("categoriesTab") },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-[var(--color-light-black)]">
        {t("title")}
      </h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[var(--color-dark-white)]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab.key
                ? "bg-[var(--color-yellow)] text-[var(--color-light-black)]"
                : "text-gray-500 hover:text-[var(--color-light-black)] hover:bg-[var(--color-dark-white)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Departments */}
      {activeTab === "departments" && (
        <EntitySection<DepartmentDTO>
          titleKey="departmentsTab"
          addLabelKey="addDepartment"
          items={departments.data}
          isLoading={departments.isLoading}
          isError={departments.isError}
          onDelete={(id) => handleDelete(id, deleteDepartment.mutate)}
          onAdd={(name) => addDepartment.mutate(name)}
          isPendingDelete={deleteDepartment.isPending}
          isPendingAdd={addDepartment.isPending}
          renderExtra={(item) => item.college}
          t={t}
        />
      )}

      {/* Colleges */}
      {activeTab === "colleges" && (
        <EntitySection<CollegeDTO>
          titleKey="collegesTab"
          addLabelKey="addCollege"
          items={colleges.data}
          isLoading={colleges.isLoading}
          isError={colleges.isError}
          onDelete={(id) => handleDelete(id, deleteCollege.mutate)}
          onAdd={(name) => addCollege.mutate(name)}
          isPendingDelete={deleteCollege.isPending}
          isPendingAdd={addCollege.isPending}
          t={t}
        />
      )}

      {/* Categories */}
      {activeTab === "categories" && (
        <EntitySection<CategoryDTO>
          titleKey="categoriesTab"
          addLabelKey="addCategory"
          items={categories.data}
          isLoading={categories.isLoading}
          isError={categories.isError}
          onDelete={(id) => handleDelete(id, deleteCategory.mutate)}
          onAdd={(name) => addCategory.mutate(name)}
          isPendingDelete={deleteCategory.isPending}
          isPendingAdd={addCategory.isPending}
          t={t}
        />
      )}
    </div>
  );
}
