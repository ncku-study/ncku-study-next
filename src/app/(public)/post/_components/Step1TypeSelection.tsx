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
      buttonText: t("majorTypeButton"),
      description: t("majorTypeDescription"),
      Icon: BookOpen,
    },
    {
      type: "study" as const,
      buttonText: t("studyTypeButton"),
      description: t("studyTypeDescription"),
      Icon: GraduationCap,
    },
  ];

  const activeItem = typeItems.find((item) => item.type === activeType) ?? typeItems[0];
  const ActiveIcon = activeItem.Icon === BookOpen ? MajorLogo : StudyLogo;

  return (
    <div className="flex flex-col justify-center pt-10 max-sm:p-0">
      <p className="flex justify-center text-dark-black mb-30 max-sm:mb-8">
        {t("chooseShareType")}
      </p>

      <div className="flex w-full items-center justify-center mb-8">
        <div className="flex flex-col justify-center items-center text-center">
          <ActiveIcon className="w-34.5 text-yellow mb-21.5 max-sm:mb-4" style={{ height: '105.42px' }} />
          <div className="w-126.5 h-17 text-center">
            {activeItem.description}
          </div>
        </div>
      </div>

      <div className="flex w-full justify-center mb-11.5">
        {typeItems.map((item) => (
          <div
            key={item.type}
            className={`mx-2 h-2.5 w-13 bg-yellow ${activeType === item.type ? 'opacity-100' : 'opacity-50'}`}
          />
        ))}
      </div>

      <div className="flex w-full justify-center mb-23.5">
        {typeItems.map((item) => (
          <button
            key={item.type}
            type="button"
            onClick={() => setValue("postType", item.type, { shouldValidate: true })}
            className={`flex h-14.5 w-51.5 items-center justify-center rounded-full border-3 border-yellow p-4 mx-10 outline-none cursor-pointer max-sm:h-auto max-sm:mx-4 max-sm:p-4 ${activeType === item.type ? 'bg-yellow text-black' : 'bg-white text-yellow'}`}
          >
            {item.buttonText}
          </button>
        ))}
      </div>

      {errors.postType && (
        <p className="mb-4 text-center text-sm text-red">
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
