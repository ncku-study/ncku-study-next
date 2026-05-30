"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { CustomStepper } from "./CustomStepper";
import { useForm, FormProvider } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { ChevronLeft } from "lucide-react";
import { Step1TypeSelection } from "./Step1TypeSelection";
import { Step2MajorForm } from "./Step2MajorForm";
import { Step2StudyForm } from "./Step2StudyForm";
import { Step3Preview } from "./Step3Preview";

export function PostFormContainer() {
  const t = useTranslations("post");
  const tCommon = useTranslations("common");
  const router = useRouter();

  // Schemas
  const majorSchema = z.object({
    category: z.string().min(1, t("required")),
    rank_1: z.string().min(1, t("required")),
    rank_2: z.string().min(1, t("required")),
    year: z.union([z.string(), z.number()]).transform(v => Number(v)),
    score: z.union([z.string(), z.number()]).transform(v => Number(v)),
    isPass: z.string().min(1, t("required")),
    out_maj: z.string().min(1, t("required")),
    in_maj: z.string().min(1, t("required")),
    department: z.string().min(1, t("required")),
    comment: z.string().min(10, t("min10Chars")),
  });

  const studySchema = z.object({
    title: z.string().min(1, t("required")),
    content: z.string().min(10, t("min10Chars")),
    year: z.union([z.string(), z.number()]).transform(v => Number(v)),
    major: z.string().min(1, t("required")),
    category: z.array(z.string()).min(1, t("selectAtLeastOne")),
  });

  const [step, setStep] = useState(1);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const methods = useForm({
    mode: "onTouched",
    defaultValues: {
      postType: undefined,
      category: "轉系",
      rank_1: "",
      rank_2: "",
      year: 114,
      score: "",
      isPass: "true",
      out_maj: "中文系",
      in_maj: "中文系",
      department: "",
      comment: "",
      title: "",
      content: "",
      major: "",
      studyCategories: [],
    },
  });

  const { watch, trigger, handleSubmit, reset } = methods;
  const postType = watch("postType");

  const steps = [
    { id: 1, title: t("step1") },
    { id: 2, title: t("step2") },
    { id: 3, title: t("step3") },
  ];

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const endpoint = postType === "major" ? "/comments" : "/studies";
      return apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      setIsPreviewOpen(false);
      setIsSuccess(true);
    },
  });

  const onNext = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await trigger("postType", { shouldFocus: true });
      if (isValid) setStep(2);
    } else if (step === 2) {
      const schema = postType === "major" ? majorSchema : studySchema;
      const values = methods.getValues();
      const result = schema.safeParse(values);
      if (!result.success) {
        if (postType === "major") {
          isValid = await trigger(["category", "rank_1", "rank_2", "year", "score", "isPass", "out_maj", "in_maj", "department", "comment"]);
        } else {
          isValid = await trigger(["title", "content", "year", "major", "studyCategories"]);
        }
      } else {
        isValid = true;
      }
      if (isValid) setIsPreviewOpen(true);
    }
  };

  const onPrev = () => {
    setStep((s) => Math.max(s - 1, 1));
  };

  const onConfirmSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  const resetForm = () => {
    reset();
    setStep(1);
    setIsSuccess(false);
  };

  return (
    <FormProvider {...methods}>
      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative bg-white p-[5px]">
            <h4 className="text-center text-[1.5rem]">請確認填寫的內容，送出之後就無法修改歐!</h4>
            <hr className="border-[rgba(0,0,0,0.12)]" />
            <Step3Preview />
            <div className="w-full h-[75px] flex justify-end items-center">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="min-w-[100px] h-[40px] rounded-[5px] bg-white text-black border-none outline-none cursor-pointer"
                style={{ marginRight: "20px" }}
              >
                返回修改
              </button>
              <button
                type="button"
                onClick={onConfirmSubmit}
                disabled={mutation.isPending}
                className="min-w-[100px] h-[40px] rounded-[5px] bg-[var(--color-yellow)] text-black border-none outline-none cursor-pointer disabled:opacity-50"
              >
                {mutation.isPending ? tCommon("loading") : "確認送出"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-3xl">
        {/* Stepper row: hidden on step 1, shown on step 2 and ThankYou */}
        {(step !== 1 || isSuccess) ? (
          <div className="h-[130px] pt-[24px]">
            <CustomStepper steps={steps} currentStep={isSuccess ? 3 : step} />
          </div>
        ) : (
          <div className="h-[130px]" />
        )}

        {isSuccess ? (
          <div className="w-full flex justify-center items-center flex-col">
            <svg
              viewBox="0 0 24 24"
              style={{ width: "12rem", height: "12rem", fill: "#FEDA6A" }}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="4" r="2" />
              <path d="M15.89 8.11C15.5 7.72 14.83 7 13.53 7h-2.54C8.24 6.99 6 4.75 6 2H4c0 3.16 2.11 5.84 5 6.71V22h2v-6h2v6h2V10.05L18.95 14l1.41-1.41-4.47-4.48z" />
            </svg>
            <h4 className="text-center text-[2.5rem] mt-[20px]">感謝你的填寫!</h4>
            <div className="text-center text-[rgba(163,158,158,1)] text-[1.4rem]">等待審查通過後就能看到你的心得囉</div>
            <div className="text-center text-[rgba(163,158,158,1)] text-[1.4rem]">若一直沒看到你的心得，請聯絡我們</div>
            <button
              onClick={() => router.push("/")}
              className="h-[40px] w-[150px] mt-[35px] rounded-[5px] bg-[var(--color-yellow)] text-black border-none outline-none cursor-pointer"
            >
              回到心得總覽頁面
            </button>
          </div>
        ) : (
        <form className="mt-0">
          <div className="mx-auto w-[458px] rounded-[5px] bg-white mb-[20px] max-[870px]:w-[80%]">
            {step === 1 && <Step1TypeSelection />}
            {step === 2 && postType === "major" && <Step2MajorForm />}
            {step === 2 && postType === "study" && <Step2StudyForm />}

            <div className={step === 1 ? "mt-0 flex justify-end items-center h-[75px]" : "mt-8 flex justify-between"}>
              <Button
                type="button"
                variant="outline"
                onClick={onPrev}
                disabled={step === 1}
                className={step === 1 ? "invisible" : ""}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                {t("back")}
              </Button>

              {step === 1 ? (
                <button
                  type="button"
                  onClick={onNext}
                  className="min-w-[100px] h-[40px] rounded-[5px] bg-[var(--color-yellow)] text-black hover:bg-[var(--color-yellow)]/90 border-none outline-none cursor-pointer"
                >
                  {t("next")} <span className="ml-1">&gt;</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onNext}
                  className="min-w-[100px] h-[40px] rounded-[5px] bg-[var(--color-yellow)] text-black hover:bg-[var(--color-yellow)]/90 border-none outline-none cursor-pointer"
                >
                  {t("next")} <span className="ml-1">&gt;</span>
                </button>
              )}
            </div>
          </div>
        </form>
        )}
      </div>
    </FormProvider>
  );
}
