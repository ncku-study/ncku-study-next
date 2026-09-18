import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { adminApiFetch, apiFetch } from "@/lib/api-client";

type Option = { value: string | number; text: string };

function getLatestAcademicYear() {
  const now = new Date();
  const year = now.getFullYear() - 1911;
  return now.getMonth() < 7 ? year - 1 : year;
}

const fieldLabelStyle = {
  top: "-18px",
  fontFamily: "Noto Sans TC, Microsoft JhengHei, sans-serif",
  fontSize: "13.75px",
  lineHeight: "19.6429px",
  fontWeight: 400,
  color: "var(--color-form-label)",
};

const inputStyle = {
  fontFamily: "Noto Sans TC, Microsoft JhengHei, sans-serif",
  fontSize: "17px",
  lineHeight: "24.2857px",
};

const dropdownStyle = {
  ...inputStyle,
  fontSize: "18px",
  lineHeight: "25.7143px",
  color: "var(--color-dark-black)",
};

function DropdownField({
  name,
  label,
  value,
  options,
  register,
  onChange,
}: {
  name: string;
  label: string;
  value: string | number;
  options: Option[];
  register: ReturnType<typeof useFormContext>["register"];
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
    <div ref={rootRef} className="relative h-24 w-full">
      <label
        className="pointer-events-none absolute left-0"
        style={{ ...fieldLabelStyle, color: focused || open ? "var(--color-form-accent)" : fieldLabelStyle.color }}
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
        className="flex h-16 w-full cursor-pointer select-none items-center justify-between border-b border-form-border bg-transparent outline-none"
        style={{
          ...dropdownStyle,
          borderBottomColor: focused || open ? "var(--color-form-accent)" : "var(--color-form-field-border)",
          borderBottomWidth: focused || open ? "2px" : undefined,
        }}
      >
        {selected?.text ?? ""}
        <span aria-hidden="true" className="ml-1 text-[0.75rem] text-form-arrow">▾</span>
      </div>
      <input type="hidden" {...register(name)} value={String(value ?? "")} readOnly />
      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-17 z-50 max-h-120 min-w-full overflow-y-auto rounded bg-white py-1 shadow-lg outline outline-1 outline-border-muted"
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
                className={`flex cursor-pointer select-none items-center px-4 py-2 text-[1.8rem] hover:bg-surface-subtle ${isSelected ? "font-medium" : ""}`}
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

export function Step2MajorForm({ isAdmin = false }: { isAdmin?: boolean }) {
  const t = useTranslations("post");
  const { register, watch, setValue } = useFormContext();
  const year = watch("year");
  const category = watch("category");
  const outMaj = watch("out_maj");
  const inMaj = watch("in_maj");
  const rank1 = watch("rank_1");
  const rank2 = watch("rank_2");
  const score = watch("score");
  const isPass = watch("isPass");
  const comment = watch("comment");

  const { data: departments } = useQuery({
    queryKey: isAdmin ? ["admin-departments-form"] : ["departments"],
    queryFn: () => isAdmin
      ? adminApiFetch<{ id: string; name: string }[]>("/departments")
      : apiFetch<{ id: string; name: string }[]>("/departments"),
    staleTime: isAdmin ? 0 : 60_000,
    gcTime: isAdmin ? 0 : 60_000,
  });

  const { data: colleges } = useQuery({
    queryKey: isAdmin ? ["admin-colleges-form"] : ["colleges"],
    queryFn: () => isAdmin
      ? adminApiFetch<{ id: string; name: string }[]>("/colleges")
      : apiFetch<{ id: string; name: string }[]>("/colleges"),
    staleTime: isAdmin ? 0 : 60_000,
    gcTime: isAdmin ? 0 : 60_000,
  });

  useEffect(() => {
    if (inMaj) setValue("department", inMaj, { shouldValidate: false });
  }, [inMaj, setValue]);

  const latestYear = getLatestAcademicYear();
  const yearOptions: Option[] = Array.from({ length: 15 }, (_, index) => {
    const value = latestYear - index;
    return { value, text: String(value) };
  });
  const departmentOptions: Option[] = (departments ?? []).map((department) => ({
    value: department.name,
    text: department.name,
  }));
  const collegeOptions: Option[] = (colleges ?? []).map((college) => ({
    value: college.name,
    text: college.name,
  }));
  // Keep the legacy form's option sets: out_maj includes colleges, in_maj only departments.
  const outMajorOptions = [...departmentOptions, ...collegeOptions];
  const categoryOptions: Option[] = [
    { value: t("categoryTransfer"), text: t("categoryTransfer") },
    { value: t("categoryMinor"), text: t("categoryMinor") },
    { value: t("categoryDouble"), text: t("categoryDouble") },
  ];
  const resultOptions: Option[] = [
    { value: "true", text: t("pass") },
    { value: "false", text: t("fail") },
  ];

  const field = "mb-8";
  const inputWrap = "relative h-24 w-full";
  const inputClass = "h-16 w-full border-b border-form-border bg-transparent text-[1.7rem] outline-none";
  const remark = "text-[1.5rem] text-red";

  return (
    <div className="mx-auto w-183 bg-white max-lg:w-full">
      <div className={field}>
        <DropdownField
          name="year"
          label={t("applicationYear")}
          value={year ?? latestYear}
          options={yearOptions}
          register={register}
          onChange={(value) => setValue("year", Number(value), { shouldDirty: true, shouldValidate: true })}
        />
        <div className={remark}>{t("applicationYearHint")}</div>
      </div>

      <div className={field}>
        <DropdownField
          name="category"
          label={t("applicationCategory")}
          value={category ?? t("categoryTransfer")}
          options={categoryOptions}
          register={register}
          onChange={(value) => setValue("category", String(value), { shouldDirty: true, shouldValidate: true })}
        />
      </div>

      <div className={field}>
        <DropdownField
          name="out_maj"
          label={t("originalMajor")}
          value={outMaj ?? ""}
          options={outMajorOptions}
          register={register}
          onChange={(value) => setValue("out_maj", String(value), { shouldDirty: true, shouldValidate: true })}
        />
        <div className={remark}>{t("originalMajorHint")}</div>
      </div>

      <div className={field}>
        <DropdownField
          name="in_maj"
          label={t("targetMajor")}
          value={inMaj ?? ""}
          options={departmentOptions}
          register={register}
          onChange={(value) => setValue("in_maj", String(value), { shouldDirty: true, shouldValidate: true })}
        />
      </div>

      <div className={field}>
        <div className={inputWrap}>
          <label className="pointer-events-none absolute left-0" style={fieldLabelStyle}>{t("rankUpper")}</label>
          <input {...register("rank_1")} value={rank1 ?? ""} className={inputClass} type="number" min={1} max={200} style={{ ...inputStyle, borderBottomColor: "var(--color-form-field-border)" }} />
        </div>
      </div>

      <div className={field}>
        <div className={inputWrap}>
          <label className="pointer-events-none absolute left-0" style={fieldLabelStyle}>{t("rankLower")}</label>
          <input {...register("rank_2")} value={rank2 ?? ""} className={inputClass} type="number" min={1} max={200} style={{ ...inputStyle, borderBottomColor: "var(--color-form-field-border)" }} />
        </div>
        <div className={remark}>{t("rankHint")}</div>
      </div>

      <div className={field}>
        <div className={inputWrap}>
          <label className="pointer-events-none absolute left-0" style={fieldLabelStyle}>{t("academicScore")}</label>
          <input {...register("score")} value={score ?? ""} className={inputClass} type="number" min={50} max={100} step={0.1} style={{ ...inputStyle, borderBottomColor: "var(--color-form-field-border)" }} />
        </div>
      </div>

      <div className={field}>
        <DropdownField
          name="isPass"
          label={t("applicationResult")}
          value={isPass ?? "true"}
          options={resultOptions}
          register={register}
          onChange={(value) => setValue("isPass", String(value), { shouldDirty: true, shouldValidate: true })}
        />
      </div>

      <div className="relative mb-12 w-full">
        <label
          className="pointer-events-none absolute left-0 bg-white"
          style={{ ...fieldLabelStyle, fontWeight: 700 }}
        >
          {t("comment")}
        </label>
        <textarea
          {...register("comment")}
          value={comment ?? ""}
          className="h-100 w-full rounded border border-form-border bg-transparent p-4 text-[1.5rem] outline-none"
          style={{ lineHeight: "2.2rem" }}
        />
      </div>

      <input type="hidden" {...register("department")} value={inMaj ?? ""} readOnly />
    </div>
  );
}
