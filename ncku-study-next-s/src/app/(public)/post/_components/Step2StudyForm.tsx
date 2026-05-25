import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { useMemo } from "react";

export function Step2StudyForm() {
  const { register, watch } = useFormContext();

  const title = watch("title");
  const major = watch("major");
  const year = watch("year");

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => apiFetch<{ id: string; name: string }[]>("/categories"),
  });

  const yearOptions = useMemo(
    () =>
      Array.from({ length: 15 }).map((_, idx) => {
        const y = 114 - idx;
        return { value: y, text: String(y) };
      }),
    []
  );

  const majorOptions = useMemo(
    () => (categories ?? []).map((item) => ({ value: item.name, text: item.name })),
    [categories]
  );

  const inputWrap = "relative w-full h-[60px]";
  const label = "absolute left-0 pointer-events-none text-[1.375rem] font-normal text-[rgba(0,0,0,0.54)]";
  const baseInput = "w-full h-[40px] border-b border-gray-400 bg-transparent outline-none text-[1.7rem]";
  const field = "mb-[20px]";
  const remark = "text-[var(--color-red)]";

  return (
    <div className="mx-auto w-[458px] max-[870px]:w-[80%] bg-white">
      <p className="mb-[20px] text-[rgba(163,158,158,1)]">留下更多資訊給學弟妹吧!</p>

      <div className={field}>
        <div className={inputWrap}>
          <label className={label} style={{ top: "-18px" }}>
            心得標題
          </label>
          <input {...register("title")} value={title ?? ""} className={baseInput} />
        </div>
      </div>

      <div className={field}>
        <div className={inputWrap}>
          <label className={label} style={{ top: "-18px" }}>
            原主修科系
          </label>
          <select {...register("major")} value={major ?? ""} className={`${baseInput} appearance-none pr-6`}>
            {majorOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.text}
              </option>
            ))}
          </select>
          <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[0.65rem] text-gray-500">▾</span>
        </div>
        <div className={remark}>*如不想透漏，可以只填學院或其他。</div>
      </div>

      <div className={field}>
        <div className={inputWrap}>
          <label className={label} style={{ top: "-18px" }}>
            年份
          </label>
          <select {...register("year")} value={year ?? ""} className={`${baseInput} appearance-none pr-6`}>
            {yearOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.text}
              </option>
            ))}
          </select>
          <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[0.65rem] text-gray-500">▾</span>
        </div>
      </div>
    </div>
  );
}
