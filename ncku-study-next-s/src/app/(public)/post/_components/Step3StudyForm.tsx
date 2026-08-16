"use client";

import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Search } from "@/components/logos";
import { adminApiFetch, apiFetch } from "@/lib/api-client";

type Statistic = {
  id: string;
  name: string;
  dataType: string;
  min: number;
  max: number;
};

type StudyFormValues = {
  title: string;
  studyCategories: string[];
  statistics: Record<string, string | number>;
  content: string;
  [key: string]: unknown;
};

const inputClass =
  "w-full h-[40px] border-b border-gray-400 bg-transparent outline-none text-[1.7rem] focus:border-[var(--color-yellow)]";

export function Step3StudyForm({ isAdmin = false }: { isAdmin?: boolean }) {
  const { register, watch, setValue, formState: { errors } } = useFormContext<StudyFormValues>();
  const [search, setSearch] = useState("");
  const title = watch("title") as string;
  const selected = (watch("studyCategories") ?? []) as string[];
  const { data: statisticOptions = [] } = useQuery({
    queryKey: isAdmin ? ["admin-statistics-form"] : ["statistics"],
    queryFn: () => isAdmin
      ? adminApiFetch<Statistic[]>("/statistics")
      : apiFetch<Statistic[]>("/statistics"),
    staleTime: isAdmin ? 0 : 60_000,
    gcTime: isAdmin ? 0 : 60_000,
  });

  const visibleOptions = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return statisticOptions;
    return statisticOptions.filter((item) => item.name.toLowerCase().includes(keyword));
  }, [search, statisticOptions]);

  const toggleStatistic = (statistic: Statistic) => {
    const next = selected.includes(statistic.name)
      ? selected.filter((name) => name !== statistic.name)
      : [...selected, statistic.name];
    setValue("studyCategories", next, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className="mx-auto w-[458px] max-[870px]:w-[80%] bg-white">
      <p className="mb-[20px] text-center text-[1.7rem] text-[rgba(163,158,158,1)]">
        {title || "你未填寫心得標題"}
      </p>

      <p className="mb-[20px] text-center text-[1.7rem] text-[rgba(163,158,158,1)]">
        選擇你要分享的統計資料
      </p>

      <div className="relative mb-[20px] h-[45px] w-full">
        <input
          aria-label="搜尋統計資料"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="h-full w-full rounded-[55px] border border-black/5 bg-white px-[15px] pr-[55px] text-[1.5rem] outline-none focus:border-black/20"
        />
        <Search
          aria-hidden="true"
          style={{
            position: "absolute",
            right: "12px",
            top: "10px",
            width: "2.1875rem",
            height: "2.1875rem",
            fill: "var(--color-yellow)",
          }}
        />
      </div>

      <div className="mb-[20px] flex flex-wrap justify-center gap-[8px]">
        {visibleOptions.map((statistic) => {
          const isSelected = selected.includes(statistic.name);
          return (
            <button
              key={statistic.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => toggleStatistic(statistic)}
              className={`flex min-h-[36px] items-center justify-center rounded-[50px] border-[2px] border-[var(--color-yellow)] px-[12px] text-[1.4rem] outline-none ${
                isSelected ? "bg-[var(--color-yellow)] text-black" : "bg-white text-[var(--color-yellow)]"
              }`}
            >
              {statistic.name}
            </button>
          );
        })}
        <button
          type="button"
          className="flex min-h-[36px] items-center justify-center rounded-[50px] border-[2px] border-[var(--color-yellow)] bg-white px-[12px] text-[1.4rem] text-[var(--color-yellow)] outline-none"
        >
          + 其他類別
        </button>
      </div>

      {selected.length === 0 && (
        <p className="mb-[20px] text-left text-[1.5rem] text-black">
          *目前沒有選擇任何統計資料項目
        </p>
      )}
      {errors.studyCategories?.message && (
        <p className="mb-[20px] text-left text-[1.5rem] text-[var(--color-red)]">
          {errors.studyCategories.message as string}
        </p>
      )}

      <div className="mb-[20px]">
        {statisticOptions
          .filter((statistic) => selected.includes(statistic.name))
          .map((statistic) => (
            <div key={statistic.id} className="mb-[20px]">
              <label className="mb-[2px] block text-[1.7rem] text-[rgba(163,158,158,1)]">
                {statistic.name}
              </label>
              <input
                {...register(`statistics.${statistic.name}`)}
                type={statistic.dataType === "string" ? "text" : "number"}
                min={statistic.dataType === "string" ? undefined : statistic.min}
                max={statistic.dataType === "string" ? undefined : statistic.max}
                className={inputClass}
              />
            </div>
          ))}
      </div>

      <div className="relative mb-[20px]">
        <label className="absolute left-0 top-[-18px] text-[1.7rem] text-[rgba(0,0,0,0.54)]">
          心得
        </label>
        <textarea
          {...register("content")}
          className="h-[250px] w-full resize-none border border-gray-400 bg-transparent p-[10px] text-[1.7rem] leading-[2.8rem] tracking-[2.5px] outline-none focus:border-[var(--color-yellow)]"
        />
      </div>
    </div>
  );
}
