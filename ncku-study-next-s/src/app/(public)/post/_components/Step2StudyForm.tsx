"use client";

import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";

type Option = { value: string | number; text: string };

function getLatestAcademicYear() {
  const now = new Date();
  const year = now.getFullYear() - 1911;
  return now.getMonth() < 7 ? year - 1 : year;
}

function Dropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string | number;
  options: Option[];
  onChange: (value: string | number) => void;
}) {
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
        style={{
          top: "-18px",
          fontSize: "1.375rem",
          fontWeight: 400,
          color: focused || open ? "#f5a623" : "rgba(0,0,0,0.54)",
        }}
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
        className="flex h-[40px] w-full cursor-pointer select-none items-center justify-between border-b border-gray-400 bg-transparent text-[1.8rem] outline-none"
        style={{
          borderBottomColor: focused || open ? "#f5a623" : undefined,
          borderBottomWidth: focused || open ? "2px" : undefined,
        }}
      >
        <span>{selected?.text ?? ""}</span>
        <span className="ml-1 text-[0.75rem] text-gray-500">{open ? "▴" : "▾"}</span>
      </div>
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

export function Step2StudyForm() {
  const { register, watch, setValue } = useFormContext();
  const title = watch("title");
  const major = watch("major");
  const year = watch("year");

  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: () => apiFetch<{ id: string; name: string }[]>("/departments"),
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

  return (
    <div className="mx-auto w-[458px] bg-white max-[870px]:w-[80%]">
      <p className="mb-[20px] text-[rgba(163,158,158,1)]">留下更多資訊給學弟妹吧!</p>

      <div className="mb-[20px]">
        <div className="relative h-[60px] w-full">
          <label className="pointer-events-none absolute left-0 text-[1.375rem] font-normal text-[rgba(0,0,0,0.54)]" style={{ top: "-18px" }}>
            心得標題
          </label>
          <input {...register("title")} value={title ?? ""} className="h-[40px] w-full border-b border-gray-400 bg-transparent text-[1.7rem] outline-none" />
        </div>
      </div>

      <div className="mb-[20px]">
        <Dropdown
          label="原主修科系"
          value={major ?? ""}
          options={majorOptions}
          onChange={(value) => setValue("major", String(value), { shouldDirty: true, shouldValidate: true })}
        />
        <div className="text-[var(--color-red)]">*如不想透漏，可以只填學院或其他。</div>
      </div>

      <div className="mb-[20px]">
        <Dropdown
          label="年份"
          value={year ?? latestYear}
          options={yearOptions}
          onChange={(value) => setValue("year", Number(value), { shouldDirty: true, shouldValidate: true })}
        />
      </div>
    </div>
  );
}
