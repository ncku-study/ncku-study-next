import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { BookOpen, GraduationCap } from "lucide-react";
import { Major as MajorLogo, Study as StudyLogo } from "@/components/logos";

export function Step1TypeSelection() {
  const t = useTranslations("post");
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const selectedType = watch("postType") as "major" | "study" | undefined;

  useEffect(() => {
    if (!selectedType) {
      setValue("postType", "major", { shouldValidate: true });
    }
  }, [selectedType, setValue]);

  const activeType = selectedType ?? "major";
  const typeItems = [
    {
      type: "major" as const,
      buttonText: "轉輔雙主心得",
      description: "分享申請轉系、輔系、雙主修的過程，以及申請通過後，生活轉變的點點滴滴",
      Icon: BookOpen,
    },
    {
      type: "study" as const,
      buttonText: "一般學業心得",
      description: "交換學生、學程、跨校選課......任何學業相關的心得都能在這裡分享",
      Icon: GraduationCap,
    },
  ];

  const activeItem = typeItems.find((item) => item.type === activeType) ?? typeItems[0];
  const ActiveIcon = activeItem.Icon === BookOpen ? MajorLogo : StudyLogo;

  return (
    <div className="flex justify-center flex-col py-[25px] max-[576px]:p-0">
      <p className="flex justify-center text-[rgba(163,158,158,1)] mb-[74px] max-[576px]:mb-[20px]">
        你想要分享哪類的心得呢?
      </p>

      <div className="w-full flex justify-center items-center mb-[20px]">
        <div className="flex flex-col justify-center items-center text-center">
          <ActiveIcon className="text-[var(--color-yellow)] mb-[54px] max-sm:mb-[10px]" style={{ height: '105.42px', width: '86.25px' }} />
          <div className="w-[316px] h-[42px] text-center max-[368px]:w-full max-[368px]:h-auto">
            {activeItem.description}
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center mb-[29px]">
        {typeItems.map((item) => (
          <div
            key={item.type}
            className={`w-[32px] h-[6px] bg-[var(--color-yellow)] mx-[5px] ${activeType === item.type ? 'opacity-100' : 'opacity-50'}`}
          />
        ))}
      </div>

      <div className="flex w-full justify-center mb-[26px]">
        {typeItems.map((item) => (
          <button
            key={item.type}
            type="button"
            onClick={() => setValue("postType", item.type, { shouldValidate: true })}
            className={`flex w-[128px] h-[36px] items-center justify-center p-[10px] rounded-[50px] border-[3px] border-[var(--color-yellow)] mx-[25px] max-sm:w-[170px] max-sm:h-auto max-sm:p-[10px] max-sm:mx-[10px] outline-none cursor-pointer ${activeType === item.type ? 'bg-[var(--color-yellow)] text-black' : 'bg-white text-[var(--color-yellow)]'}`}
          >
            {item.buttonText}
          </button>
        ))}
      </div>

      {errors.postType && (
        <p className="text-center text-sm text-[var(--color-red)] mb-4">
          {errors.postType.message as string}
        </p>
      )}

      {/* Hidden radios keep react-hook-form registration intact */}
      <div className="sr-only">
        <input type="radio" value="major" {...register("postType")} />
        <input type="radio" value="study" {...register("postType")} />
      </div>
    </div>
  );
}
