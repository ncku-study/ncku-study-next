import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
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

export function Step2MajorForm({ isAdmin = false }: { isAdmin?: boolean }) {
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
    { value: "轉系", text: "轉系" },
    { value: "輔系", text: "輔系" },
    { value: "雙主修", text: "雙主修" },
  ];
  const resultOptions: Option[] = [
    { value: "true", text: "通過" },
    { value: "false", text: "未通過" },
  ];

  const field = "mb-[20px]";
  const inputWrap = "relative w-full h-[60px]";
  const inputClass = "w-full h-[40px] border-b border-gray-400 bg-transparent outline-none text-[1.7rem]";
  const remark = "relative -top-[15px] text-[1.5rem] leading-[2.14286rem] text-[var(--color-red)]";

  return (
    <div className="mx-auto w-[458px] max-[870px]:w-full bg-white">
      <div className={field}>
        <DropdownField
          name="year"
          label="申請年度"
          value={year ?? latestYear}
          options={yearOptions}
          register={register}
          onChange={(value) => setValue("year", Number(value), { shouldDirty: true, shouldValidate: true })}
        />
        <div className={remark}>*例: 110年7月申請，就填寫110年。</div>
      </div>

      <div className={field}>
        <DropdownField
          name="category"
          label="申請類別"
          value={category ?? "轉系"}
          options={categoryOptions}
          register={register}
          onChange={(value) => setValue("category", String(value), { shouldDirty: true, shouldValidate: true })}
        />
      </div>

      <div className={field}>
        <DropdownField
          name="out_maj"
          label="原主修科系"
          value={outMaj ?? ""}
          options={outMajorOptions}
          register={register}
          onChange={(value) => setValue("out_maj", String(value), { shouldDirty: true, shouldValidate: true })}
        />
        <div className={remark}>*如不想透漏，可以只填學院或其他。</div>
      </div>

      <div className={field}>
        <DropdownField
          name="in_maj"
          label="目標申請科系"
          value={inMaj ?? ""}
          options={departmentOptions}
          register={register}
          onChange={(value) => setValue("in_maj", String(value), { shouldDirty: true, shouldValidate: true })}
        />
      </div>

      <div className={field}>
        <div className={inputWrap}>
          <label className="pointer-events-none absolute left-0" style={fieldLabelStyle}>排名上</label>
          <input {...register("rank_1")} value={rank1 ?? ""} className={`${inputClass} relative top-[1px]`} type="number" min={1} max={200} style={{ ...inputStyle, borderBottomColor: "rgba(0, 0, 0, 0.42)" }} />
        </div>
      </div>

      <div className={field}>
        <div className={inputWrap}>
          <label className="pointer-events-none absolute left-0" style={fieldLabelStyle}>排名下</label>
          <input {...register("rank_2")} value={rank2 ?? ""} className={`${inputClass} relative top-[1px]`} type="number" min={1} max={200} style={{ ...inputStyle, borderBottomColor: "rgba(0, 0, 0, 0.42)" }} />
        </div>
        <div className={remark}>*如還不知道，可以留空白。</div>
      </div>

      <div className={field}>
        <div className={inputWrap}>
          <label className="pointer-events-none absolute left-0" style={fieldLabelStyle}>學年分數</label>
          <input {...register("score")} value={score ?? ""} className={`${inputClass} relative top-[1px]`} type="number" min={50} max={100} step={0.1} style={{ ...inputStyle, borderBottomColor: "rgba(0, 0, 0, 0.42)" }} />
        </div>
      </div>

      <div className={field}>
        <DropdownField
          name="isPass"
          label="申請結果"
          value={isPass ?? "true"}
          options={resultOptions}
          register={register}
          onChange={(value) => setValue("isPass", String(value), { shouldDirty: true, shouldValidate: true })}
        />
      </div>

      <div className="relative mb-[30px] w-full">
        <label
          className="pointer-events-none absolute left-[14px] bg-white"
          style={{ ...fieldLabelStyle, top: "-2.5px", fontWeight: 700 }}
        >
          心得
        </label>
        <textarea
          {...register("comment")}
          value={comment ?? ""}
          className="w-full rounded border border-gray-400 bg-transparent p-[10px] text-[1.5rem] leading-[2.2rem] outline-none"
          style={{ height: "250px" }}
        />
      </div>

      <input type="hidden" {...register("department")} value={inMaj ?? ""} readOnly />
    </div>
  );
}
