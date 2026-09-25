"use client";

import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
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
  otherStat: Array<{ name: string; value: string }>;
  content: string;
  [key: string]: unknown;
};

const inputClass =
  "h-10 w-full border-b border-form-field-border bg-transparent text-[1.7rem] outline-none focus:border-yellow";

export function Step3StudyForm({ isAdmin = false }: { isAdmin?: boolean }) {
  const t = useTranslations("post");
  const { control, register, watch, setValue, formState: { errors } } = useFormContext<StudyFormValues>();
  const { fields: otherStats, append, remove } = useFieldArray({ control, name: "otherStat" });
  const [search, setSearch] = useState("");
  const [viewportWidth, setViewportWidth] = useState(0);
  const title = watch("title") as string;
  const selected = (watch("studyCategories") ?? []) as string[];
  const isCompact = viewportWidth > 0 && viewportWidth <= 1024;
  const isMobile = viewportWidth > 0 && viewportWidth <= 640;

  useEffect(() => {
    const updateViewportWidth = () => setViewportWidth(window.innerWidth);
    updateViewportWidth();
    window.addEventListener("resize", updateViewportWidth);
    return () => window.removeEventListener("resize", updateViewportWidth);
  }, []);
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
    <div
      className="mx-auto w-full bg-white"
      style={{ width: isCompact ? "100%" : "458px" }}
    >
      <div className="flex items-center" style={{ marginBottom: "20px" }}>
        <div className="mr-2 bg-yellow" style={{ width: "7px" }} />
        <p
          className="text-[18px] text-form-label"
          style={{ margin: 0, lineHeight: "25.7143px" }}
        >
          {title || t("missingStudyTitle")}
        </p>
      </div>

      <p className="text-center text-[1.5rem] text-form-label" style={{ marginBottom: "20px" }}>
        {t("selectStatistics")}
      </p>

      <div
        className="relative w-full"
        style={{ height: isMobile ? "35px" : "45px", marginBottom: "20px" }}
      >
        <input
          aria-label={t("searchStatistics")}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="h-full w-full rounded-full border border-input-border bg-white p-0 text-[1.5rem] outline-none focus:border-control-border"
          style={{ padding: "10px 15px" }}
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

      <div className="flex flex-wrap" style={{ marginBottom: "20px" }}>
        {visibleOptions.map((statistic) => {
          const isSelected = selected.includes(statistic.name);
          return (
            <button
              key={statistic.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => toggleStatistic(statistic)}
              className={`m-0 flex h-auto items-center justify-center rounded-full border border-solid border-yellow p-0 text-[1.4rem] outline-none ${
                isSelected ? "bg-yellow text-card-text" : "bg-white text-yellow"
              }`}
              style={{ margin: "5px", padding: "5px 10px" }}
            >
              {statistic.name}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => append({ name: "", value: "" }, { shouldFocus: true })}
          className="m-0 flex h-auto items-center justify-center rounded-full border border-solid border-yellow bg-white p-0 text-[1.4rem] text-yellow outline-none"
          style={{ margin: "5px", padding: "5px 10px" }}
        >
          {t("otherCategory")}
        </button>
      </div>

      {selected.length === 0 && otherStats.length === 0 && (
        <p className="text-left text-[1.5rem] text-card-text" style={{ marginBottom: "20px" }}>
          {t("noStatisticsSelected")}
        </p>
      )}
      {errors.studyCategories?.message && (
        <p className="text-left text-[1.5rem] text-red" style={{ marginBottom: "20px" }}>
          {errors.studyCategories.message as string}
        </p>
      )}

      {otherStats.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          {otherStats.map((field, index) => (
            <div key={field.id} style={{ marginBottom: "20px" }}>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-[1.7rem] text-dark-gray">
                  {t("otherOption")} - {index + 1}
                </label>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  aria-label={t("removeOtherOption")}
                  className="border-0 bg-transparent p-0 text-[1.5rem] text-dark-gray outline-none"
                >
                  ×
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  {...register(`otherStat.${index}.name`)}
                  aria-label={t("otherOptionNamePlaceholder")}
                  placeholder={t("otherOptionNamePlaceholder")}
                  className={inputClass}
                />
                <input
                  {...register(`otherStat.${index}.value`)}
                  aria-label={t("otherOptionValuePlaceholder")}
                  placeholder={t("otherOptionValuePlaceholder")}
                  className={inputClass}
                />
              </div>
            </div>
          ))}
          <p className="text-[1.3rem] text-form-label">{t("otherOptionReviewHint")}</p>
        </div>
      )}

      <div style={{ marginBottom: "20px" }}>
        {statisticOptions
          .filter((statistic) => selected.includes(statistic.name))
          .map((statistic) => (
            <div key={statistic.id} style={{ marginBottom: "20px" }}>
              <label className="block text-[1.7rem] text-dark-gray" style={{ marginBottom: "2px" }}>
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

      <div className="relative" style={{ marginBottom: "30px" }}>
        <label
          className="pointer-events-none absolute left-0 text-form-label"
          style={{
            top: "-18px",
            fontSize: "1.375rem",
            fontWeight: 700,
            backgroundColor: "var(--color-white)",
          }}
        >
          {t("studyComment")}
        </label>
        <textarea
          {...register("content")}
          className="w-full resize-none border border-form-field-border bg-transparent p-0 text-[1.7rem] outline-none focus:border-yellow"
          style={{ height: "250px", padding: "10px", lineHeight: "22px", letterSpacing: "2.5px" }}
        />
      </div>
    </div>
  );
}
