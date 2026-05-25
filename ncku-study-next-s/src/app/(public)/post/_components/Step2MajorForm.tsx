import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { useEffect } from "react";

export function Step2MajorForm() {
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
    queryKey: ["departments"],
    queryFn: () => apiFetch<{ id: string; name: string }[]>("/departments"),
  });

  useEffect(() => {
    if (inMaj) {
      setValue("department", inMaj, { shouldValidate: false });
    }
  }, [inMaj, setValue]);

  const options = departments?.map((d) => d.name) ?? [];

  const inputWrap = "relative w-full h-[60px]";
  const label = "absolute left-0 pointer-events-none text-[1.2rem] font-normal text-[rgba(0,0,0,0.54)]";
  const baseInput = "w-full h-[40px] border-b border-gray-400 bg-transparent outline-none text-[1.6rem]";
  const remark = "text-[1.4rem] text-[var(--color-red)]";
  const field = "mb-[20px]";

  return (
    <div className="mx-auto w-[458px] max-[870px]:w-[80%] bg-white">
      <div className={field}>
        <div className={inputWrap}>
          <label className={label} style={{ top: '-18px' }}>申請年度</label>
          <select {...register("year")} value={year ?? ''} className={`${baseInput} appearance-none pr-6`}>
            {Array.from({ length: 15 }).map((_, idx) => {
              const y = 114 - idx;
              return <option key={y} value={y}>{y}</option>;
            })}
          </select>
          <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[0.65rem] text-gray-500">▾</span>
        </div>
        <div className={remark}>*例: 110年7月申請，就填寫110年。</div>
      </div>

      <div className={field}>
        <div className={inputWrap}>
          <label className={label} style={{ top: '-18px' }}>申請類別</label>
          <select {...register("category")} value={category ?? ''} className={`${baseInput} appearance-none pr-6`}>
            <option value="轉系">轉系</option>
            <option value="輔系">輔系</option>
            <option value="雙主修">雙主修</option>
          </select>
          <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[0.65rem] text-gray-500">▾</span>
        </div>
      </div>

      <div className={field}>
        <div className={inputWrap}>
          <label className={label} style={{ top: '-18px' }}>原主修科系</label>
          <select {...register("out_maj")} value={outMaj ?? ''} className={`${baseInput} appearance-none pr-6`}>
            {options.map((name) => <option key={`out-${name}`} value={name}>{name}</option>)}
          </select>
          <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[0.65rem] text-gray-500">▾</span>
        </div>
        <div className={remark}>*如不想透漏，可以只填學院或其他。</div>
      </div>

      <div className={field}>
        <div className={inputWrap}>
          <label className={label} style={{ top: '-18px' }}>目標申請科系</label>
          <select {...register("in_maj")} value={inMaj ?? ''} className={`${baseInput} appearance-none pr-6`}>
            {options.map((name) => <option key={`in-${name}`} value={name}>{name}</option>)}
          </select>
          <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[0.65rem] text-gray-500">▾</span>
        </div>
      </div>

      <div className={field}>
        <div className={inputWrap}>
          <label className={label} style={{ top: '-18px' }}>排名上</label>
          <input {...register("rank_1")} value={rank1 ?? ''} className={baseInput} type="text" />
        </div>
      </div>

      <div className={field}>
        <div className={inputWrap}>
          <label className={label} style={{ top: '-18px' }}>排名下</label>
          <input {...register("rank_2")} value={rank2 ?? ''} className={baseInput} type="text" />
        </div>
        <div className={remark}>*如還不知道，可以留空白。</div>
      </div>

      <div className={field}>
        <div className={inputWrap}>
          <label className={label} style={{ top: '-18px' }}>學年分數</label>
          <input {...register("score")} value={score ?? ''} className={baseInput} type="text" />
        </div>
      </div>

      <div className={field}>
        <div className={inputWrap}>
          <label className={label} style={{ top: '-18px' }}>申請結果</label>
          <select {...register("isPass")} value={isPass ?? ''} className={`${baseInput} appearance-none pr-6`}>
            <option value="true">通過</option>
            <option value="false">未通過</option>
          </select>
          <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[0.65rem] text-gray-500">▾</span>
        </div>
      </div>

      <div className="mb-[30px] relative w-full">
        <label
          className="absolute left-0 pointer-events-none"
          style={{ top: '-18px', fontSize: '1.2rem', fontWeight: 700, color: 'rgba(0,0,0,0.54)', backgroundColor: 'white' }}
        >
          心得
        </label>
        <textarea
          {...register("comment")}
          value={comment ?? ''}
          className="w-full border border-gray-400 rounded bg-transparent outline-none text-[1.3rem] leading-[1.8rem] p-[10px] resize-none overflow-auto"
          style={{ height: '250px' }}
        />
      </div>

      <input type="hidden" {...register("department")} value={inMaj ?? ''} />
    </div>
  );
}
