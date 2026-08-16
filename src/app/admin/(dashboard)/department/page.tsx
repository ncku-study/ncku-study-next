"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { CollegeDTO, DepartmentDTO } from "@/types/api";
import { adminApiFetch } from "@/lib/api-client";

// ---------- Types ----------

type College = CollegeDTO & { nameNext?: string };
type Department = DepartmentDTO & { nameNext?: string };

// ---------- Inline EditList (mirrors vite EditList) ----------

function EditListItem({
  displayName,
  highlighted,
  inputArr,
  onSubmit,
  onDelete,
}: {
  displayName: string;
  highlighted: boolean;
  inputArr: { id: string; value: string; wording: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }[];
  onSubmit: () => void;
  onDelete?: () => void;
}) {
  const t = useTranslations("admin");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [displayName]);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        className="w-full flex items-center justify-between px-[16px] py-[8px] hover:bg-black/4 text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <span className={`text-[1rem] ${highlighted ? "font-bold" : ""}`}>
          {highlighted ? `*${displayName}` : displayName}
        </span>
        <span className="text-gray-400 text-[1.2rem]">{open ? "▲" : "✎"}</span>
      </button>
      {open && (
        <div className="px-[16px] pb-[12px] flex flex-col gap-[8px] bg-gray-50">
          {inputArr.map(({ id, value, wording, onChange }) => (
            <div key={id} className="flex flex-col gap-[4px]">
              <label className="text-[0.85rem] text-gray-500">{wording}</label>
              <input
                value={value}
                onChange={onChange}
                className="border border-gray-200 rounded px-[8px] py-[4px] text-[0.95rem] outline-none focus:border-[var(--color-yellow)]"
              />
            </div>
          ))}
          <div className="flex justify-end gap-[8px] mt-[4px]">
            {onDelete && (
              <button
                onClick={() => { if (window.confirm(t("confirmDeleteNamed", { name: displayName }))) onDelete(); }}
                className="px-[12px] py-[4px] bg-red-500 text-white rounded text-[0.9rem] hover:opacity-80"
              >
                {t("delete")}
              </button>
            )}
            <button
              onClick={onSubmit}
              className="px-[12px] py-[4px] bg-[var(--color-yellow)] text-[var(--color-light-black)] rounded text-[0.9rem] hover:opacity-80"
            >
              {t("submitUpdate")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Main Page ----------

export default function AdminDepartmentPage() {
  const t = useTranslations("admin");
  const [colleges, setColleges] = useState<College[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [colSelected, setColSelected] = useState<College | undefined>(undefined);
  const [newCollegeName, setNewCollegeName] = useState("");
  const [newDepartmentName, setNewDepartmentName] = useState("");

  // Fetch colleges and departments
  const loadData = async () => {
    try {
      const [colRes, depRes] = await Promise.all([
        adminApiFetch<College[]>("/colleges"),
        adminApiFetch<Department[]>("/departments"),
      ]);
      setColleges(colRes);
      setDepartments(depRes);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredDeps = colSelected && colSelected.id !== -1
    ? departments.filter((d) => d.college === colSelected.name)
    : [];

  // College operations
  const handleUpdateCollege = async (college: College) => {
    if (!college.nameNext || college.nameNext === college.name) return;
    await adminApiFetch(`/colleges/${college.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: college.nameNext }),
    });
    await loadData();
    setColSelected((prev) =>
      prev?.id === college.id ? { ...prev, name: college.nameNext!, nameNext: undefined } : prev
    );
  };

  const handleDeleteCollege = async (id: number) => {
    await adminApiFetch(`/colleges/${id}`, { method: "DELETE" });
    setColSelected(undefined);
    await loadData();
  };

  const handleCreateCollege = async () => {
    if (!newCollegeName.trim()) return;
    await adminApiFetch("/colleges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCollegeName.trim() }),
    });
    setNewCollegeName("");
    setColSelected(undefined);
    await loadData();
  };

  // Department operations
  const handleUpdateDepartment = async (dep: Department) => {
    if (!dep.nameNext || dep.nameNext === dep.name) return;
    await adminApiFetch(`/departments/${dep.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: dep.nameNext, college: dep.college }),
    });
    setDepartments((prev) =>
      prev.map((d) => d.id === dep.id ? { ...d, name: dep.nameNext!, nameNext: undefined } : d)
    );
  };

  const handleDeleteDepartment = async (id: number) => {
    await adminApiFetch(`/departments/${id}`, { method: "DELETE" });
    setDepartments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleCreateDepartment = async () => {
    if (!newDepartmentName.trim() || !colSelected || colSelected.id === -1) return;
    await adminApiFetch("/departments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newDepartmentName.trim(), college: colSelected.name }),
    });
    setNewDepartmentName("");
    await loadData();
  };

  if (isLoading) {
    return (
      <div className="flex gap-[20px] p-[20px]">
        <div className="w-[180px] h-[300px] rounded bg-gray-100 animate-pulse" />
        <div className="flex-1 h-[300px] rounded bg-gray-100 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex gap-[20px] min-h-0 p-[10px]">
      {/* Left: College List */}
      <div className="w-[180px] shrink-0 border border-gray-100 rounded overflow-hidden self-start">
        <ul className="list-none m-0 p-0">
          {colleges.map((item) => (
            <li
              key={item.id}
              data-selected={colSelected?.name === item.name}
              onClick={() => setColSelected({ ...item })}
              className="py-[8px] px-[16px] cursor-pointer flex items-center hover:bg-black/4 data-[selected=true]:bg-[var(--color-yellow)]/20 data-[selected=true]:font-semibold"
            >
              <span className="text-[1rem]">{item.name}</span>
            </li>
          ))}
          <li
            data-selected={colSelected?.id === -1}
            onClick={() => setColSelected({ id: -1, name: "", nameNext: "" })}
            className="py-[8px] px-[16px] cursor-pointer flex items-center hover:bg-black/4 data-[selected=true]:bg-[var(--color-yellow)]/20 data-[selected=true]:font-semibold"
          >
            <span className="text-[1rem]">{t("add")}</span>
          </li>
        </ul>
      </div>

      {/* Right: Edit Panel */}
      <div className="flex-1 min-w-0">
        {!colSelected && (
          <p className="text-gray-400 text-[1rem] mt-[16px]">{t("selectCollege")}</p>
        )}

        {/* Add new college */}
        {colSelected && colSelected.id === -1 && (
          <div className="flex flex-col gap-[10px] max-w-[400px]">
            <h4 className="text-[1rem] font-semibold mb-[4px]">{t("addCollege")}</h4>
            <div className="flex flex-col gap-[4px]">
              <label className="text-[0.85rem] text-gray-500">{t("newCollegeName")}</label>
              <input
                value={newCollegeName}
                onChange={(e) => setNewCollegeName(e.target.value)}
                className="border border-gray-200 rounded px-[8px] py-[4px] text-[0.95rem] outline-none focus:border-[var(--color-yellow)]"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleCreateCollege}
                disabled={!newCollegeName.trim()}
                className="px-[15px] py-[6px] bg-[var(--color-yellow)] text-[var(--color-light-black)] rounded text-[0.95rem] hover:opacity-80 disabled:opacity-50"
              >
                {t("confirmAdd")}
              </button>
            </div>
          </div>
        )}

        {/* Edit existing college */}
        {colSelected && colSelected.id !== -1 && (
          <>
            <div className="mb-[20px]">
              <h4 className="text-[1rem] font-semibold mb-[8px]">{t("currentCollege")}</h4>
              <EditListItem
                displayName={colSelected.name}
                highlighted={!!(colSelected.nameNext && colSelected.nameNext !== colSelected.name)}
                inputArr={[{
                  id: "0",
                  value: colSelected.nameNext ?? colSelected.name,
                  wording: t("name"),
                  onChange: (e) => setColSelected((prev) => prev ? { ...prev, nameNext: e.target.value } : prev),
                }]}
                onSubmit={() => handleUpdateCollege(colSelected)}
                onDelete={() => handleDeleteCollege(colSelected.id)}
              />
            </div>

            <div>
              <h4 className="text-[1rem] font-semibold mb-[8px]">{t("departmentList")}</h4>
              {filteredDeps.map((dep) => (
                <EditListItem
                  key={dep.id}
                  displayName={dep.name}
                  highlighted={!!(dep.nameNext && dep.nameNext !== dep.name)}
                  inputArr={[{
                    id: "0",
                    value: dep.nameNext ?? dep.name,
                    wording: t("name"),
                    onChange: (e) =>
                      setDepartments((prev) =>
                        prev.map((d) => d.id === dep.id ? { ...d, nameNext: e.target.value } : d)
                      ),
                  }]}
                  onSubmit={() => handleUpdateDepartment(dep)}
                  onDelete={() => handleDeleteDepartment(dep.id)}
                />
              ))}

              {/* Add department */}
              <EditListItem
                displayName={t("addDepartment")}
                highlighted={newDepartmentName !== ""}
                inputArr={[{
                  id: "0",
                  value: newDepartmentName,
                  wording: t("newDepartmentName"),
                  onChange: (e) => setNewDepartmentName(e.target.value),
                }]}
                onSubmit={handleCreateDepartment}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
