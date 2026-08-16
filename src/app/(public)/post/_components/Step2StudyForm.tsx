"use client";

import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { adminApiFetch, apiFetch } from "@/lib/api-client";

type Option = { value: string | number; text: string };

function getLatestAcademicYear() {
  const now = new Date();
  const year = now.getFullYear() - 1911;
  return now.getMonth() < 7 ? year - 1 : year;
}

const fieldLabelStyle = {
  top: "-15px",
  fontFamily: "Roboto, Helvetica, Arial, sans-serif",
  fontSize: "22px",
  lineHeight: "22px",
  fontWeight: 400,
  letterSpacing: "0.20636px",
  color: "rgba(0, 0, 0, 0.54)",
  transform: "translateY(1.5px) scale(0.75)",
  transformOrigin: "top left",
};

const inputStyle = {
  fontFamily: "Roboto, Helvetica, Arial, sans-serif",
  fontSize: "17px",
  lineHeight: "11.876px",
  letterSpacing: "0.0938px",
};

const dropdownStyle = {
  ...inputStyle,
  fontSize: "18px",
  color: "rgba(0, 0, 0, 0.87)",
};

function Dropdown({
  name,
  label,
  value,
  options,
  onChange,
}: {
  name: string;
  label: string;
  value: string | number;
  options: Option[];
  onChange: (value: string | number) => void;
}) {
  const { register } = useFormContext();
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => String(option.value) === String(value));

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={rootRef} className="relative h-[60px] w-full">
      <label
        className="pointer-events-none absolute left-0"
        style={{ ...fieldLabelStyle, color: focused || open ? "#f5a623" : fieldLabelStyle.color }}
      >
        {label}
      </label>
      <div
        role="button"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={open}
        onMouseDown={(event) => {
          event.preventDefault();
          setOpen((current) => !current);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
          }
        }}
        className="flex h-[40px] w-full cursor-pointer select-none items-center justify-between border-b border-gray-400 bg-transparent outline-none"
        style={{
          ...dropdownStyle,
          position: "relative",
          top: "1px",
          borderBottomColor: focused || open ? "#f5a623" : "rgba(0, 0, 0, 0.42)",
          borderBottomWidth: focused || open ? "2px" : undefined,
        }}
      >
        {selected?.text ?? ""}
        <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </div>
      <input type="hidden" {...register(name)} value={String(value ?? "")} readOnly />
      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-[42px] z-50 max-h-[300px] min-w-full overflow-y-auto rounded bg-white py-1 shadow-lg outline outline-1 outline-gray-200"
        >
          {options.map((option) => {
            const isSelected = String(option.value) === String(value);
            return (
              <li
                key={String(option.value)}
                role="option"
                aria-selected={isSelected}
                onMouseDown={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex cursor-pointer select-none items-center px-4 py-2 text-[1.8rem] hover:bg-gray-100 ${isSelected ? "font-medium" : ""}`}
              >
                {option.text}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function Step2StudyForm({ isAdmin = false }: { isAdmin?: boolean }) {
  const t = useTranslations("post");
  const { register, watch, setValue } = useFormContext();
  const title = watch("title");
  const major = watch("major");
  const year = watch("year");

  const { data: departments = [] } = useQuery({
    queryKey: isAdmin ? ["admin-departments-form"] : ["departments"],
    queryFn: () => isAdmin
      ? adminApiFetch<{ id: string; name: string }[]>("/departments")
      : apiFetch<{ id: string; name: string }[]>("/departments"),
    staleTime: isAdmin ? 0 : 60_000,
    gcTime: isAdmin ? 0 : 60_000,
  });

  const latestYear = getLatestAcademicYear();
  const yearOptions: Option[] = Array.from({ length: 5 }, (_, index) => {
    const value = latestYear - index;
    return { value, text: String(value) };
  });
  const majorOptions: Option[] = departments.map((item) => ({
    value: item.name,
    text: item.name,
  }));

  const field = "mb-[20px]";
  const remark = "relative -top-[15px] text-[1.5rem] leading-[2.14286rem] text-[var(--color-red)]";

  return (
    <div className="mx-auto w-[458px] bg-white max-[870px]:w-full">
      <p className="relative -top-[15px] mb-[20px] flex justify-center text-[rgba(163,158,158,1)]">
        {t("studyIntro")}
      </p>

      <div className={field}>
        <div className="relative h-[60px] w-full">
          <label className="pointer-events-none absolute left-0" style={fieldLabelStyle}>
            {t("studyTitle")}
          </label>
          <input
            {...register("title")}
            value={title ?? ""}
            className="relative top-[4.40625px] h-[33.1875px] w-full border-0 bg-transparent p-0 outline-none"
            style={{ ...inputStyle, boxSizing: "border-box", padding: "6px 0 7px" }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 w-full border-t border-gray-400"
            style={{ top: "39.578125px", borderTopColor: "rgba(0, 0, 0, 0.42)" }}
          />
        </div>
      </div>

      <div className={field}>
        <Dropdown
          name="major"
          label={t("originalMajor")}
          value={major ?? ""}
          options={majorOptions}
          onChange={(value) => setValue("major", String(value), { shouldDirty: true, shouldValidate: true })}
        />
        <div className={remark}>{t("originalMajorHint")}</div>
      </div>

      <div className={field}>
        <Dropdown
          name="year"
          label={t("year")}
          value={year ?? latestYear}
          options={yearOptions}
          onChange={(value) => setValue("year", Number(value), { shouldDirty: true, shouldValidate: true })}
        />
      </div>
    </div>
  );
}
