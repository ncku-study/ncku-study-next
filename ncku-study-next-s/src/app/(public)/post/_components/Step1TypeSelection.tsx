import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BookOpen, GraduationCap } from "lucide-react";

export function Step1TypeSelection() {
  const t = useTranslations("post");
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const selectedType = watch("postType");

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{t("step1")}</h2>
        <p className="text-muted-foreground mt-2">{t("step1Desc")}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card
          className={cn(
            "relative flex cursor-pointer flex-col items-center gap-4 p-8 transition-all hover:border-primary",
            selectedType === "major" ? "border-2 border-primary bg-primary/5" : "border-2 border-transparent"
          )}
          onClick={() => setValue("postType", "major", { shouldValidate: true })}
        >
          <div className="rounded-full bg-primary/10 p-4 text-primary">
            <GraduationCap className="h-8 w-8" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold">{t("typeMajor")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t("typeMajorDesc")}</p>
          </div>
          {/* Hidden radio for react-hook-form */}
          <input type="radio" value="major" {...register("postType")} className="sr-only" />
        </Card>

        <Card
          className={cn(
            "relative flex cursor-pointer flex-col items-center gap-4 p-8 transition-all hover:border-primary",
            selectedType === "study" ? "border-2 border-primary bg-primary/5" : "border-2 border-transparent"
          )}
          onClick={() => setValue("postType", "study", { shouldValidate: true })}
        >
          <div className="rounded-full bg-primary/10 p-4 text-primary">
            <BookOpen className="h-8 w-8" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold">{t("typeStudy")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t("typeStudyDesc")}</p>
          </div>
          <input type="radio" value="study" {...register("postType")} className="sr-only" />
        </Card>
      </div>
      
      {errors.postType && (
        <p className="text-center text-sm text-destructive">
          {errors.postType.message as string}
        </p>
      )}
    </div>
  );
}
