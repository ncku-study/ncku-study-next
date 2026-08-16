"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { CustomStepper } from "./CustomStepper";
import { useForm, FormProvider } from "react-hook-form";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { Step1TypeSelection } from "./Step1TypeSelection";
import { Step2MajorForm } from "./Step2MajorForm";
import { Step2StudyForm } from "./Step2StudyForm";
import { Step3StudyForm } from "./Step3StudyForm";
import { Step3Preview } from "./Step3Preview";
import type { ReactElement } from "react";

export interface PostFormEditProps {
  editMode: true;
  editType: "major" | "study";
  editId: string | number;
  editDefaultValues: Record<string, unknown>;
  isAdmin?: boolean;
}

function getLatestAcademicYear() {
  const now = new Date();
  const year = now.getFullYear() - 1911;
  return now.getMonth() < 7 ? year - 1 : year;
}

type PostFormValues = {
  postType?: "major" | "study";
  category: string;
  rank_1: string;
  rank_2: string;
  year: string | number;
  score: string | number;
  isPass: string;
  out_maj: string;
  in_maj: string;
  department: string;
  comment: string;
  title: string;
  content: string;
  major: string;
  studyCategories: string[];
  statistics: Record<string, string | number>;
};

export function PostFormContainer(): ReactElement;
export function PostFormContainer(props: PostFormEditProps): ReactElement;
export function PostFormContainer(props?: PostFormEditProps) {
  const isEditMode = props?.editMode === true;
  const isAdmin = props?.isAdmin === true;
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

  const [step, setStep] = useState(isEditMode ? 2 : 1);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (step !== 2 || typeof window === "undefined" || window.innerWidth <= 870) return;

    const scrollContainer = Array.from(document.querySelectorAll<HTMLElement>("*"))
      .find((element) => {
        const style = getComputedStyle(element);
        return element.clientHeight === window.innerHeight
          && element.scrollHeight > element.clientHeight
          && style.overflowY !== "visible";
      });

    if (!scrollContainer) return;
    const frame = window.requestAnimationFrame(() => {
      scrollContainer.scrollTop = 111;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [step]);

  const baseDefaults = {
    postType: isEditMode ? props!.editType : undefined,
    category: "轉系",
    rank_1: "",
    rank_2: "",
    year: getLatestAcademicYear(),
    score: "",
    isPass: "true",
    out_maj: "中文系",
    in_maj: "中文系",
    department: "",
    comment: "",
    title: "",
    content: "",
    major: "中文系",
    studyCategories: [] as string[],
    statistics: {} as Record<string, string | number>,
  };

  const methods = useForm<PostFormValues>({
    mode: "onTouched",
    defaultValues: isEditMode
      ? { ...baseDefaults, ...props!.editDefaultValues, postType: props!.editType }
      : baseDefaults,
  });

  const { watch, trigger, handleSubmit, setError, clearErrors } = methods;
  const postType = watch("postType");

  const steps = postType === "study"
    ? [
        { id: 1, title: t("step1") },
        { id: 2, title: t("step2") },
        { id: 3, title: t("step3") },
        { id: 4, title: t("step4") },
      ]
    : [
        { id: 1, title: t("step1") },
        { id: 2, title: `${t("step2")}和心得內文` },
        { id: 3, title: t("step4") },
      ];

  const mutation = useMutation({
    mutationFn: async (data: PostFormValues) => {
      if (isEditMode) {
        const endpoint =
          props!.editType === "major"
            ? `/comments/${props!.editId}`
            : `/studies/${props!.editId}`;
        return apiFetch(endpoint, {
          method: "PUT",
          body: JSON.stringify(data),
        });
      }
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
    } else if (step === 2 && postType === "major") {
      const values = methods.getValues();
      const result = majorSchema.safeParse(values);
      if (!result.success) {
        isValid = await trigger(["category", "rank_1", "rank_2", "year", "score", "isPass", "out_maj", "in_maj", "department", "comment"]);
      } else {
        isValid = true;
      }
      if (isValid) setIsPreviewOpen(true);
    } else if (step === 2 && postType === "study") {
      isValid = await trigger(["title", "year", "major"]);
      if (isValid) setStep(3);
    } else if (step === 3 && postType === "study") {
      const values = methods.getValues();
      const selected = Array.isArray(values.studyCategories) ? values.studyCategories : [];
      const statistics = values.statistics ?? {};
      const hasEmptyStatistic = selected.some((name: string) => {
        const value = statistics[name];
        return value === undefined || value === null || String(value).trim() === "";
      });

      clearErrors("studyCategories");
      isValid = await trigger("content");
      if (selected.length === 0) {
        setError("studyCategories", { type: "manual", message: t("selectAtLeastOne") });
        isValid = false;
      } else if (hasEmptyStatistic) {
        setError("studyCategories", { type: "manual", message: t("fillSelectedStatistic") });
        isValid = false;
      }
      if (isValid) setIsPreviewOpen(true);
    }
  };

  const onPrev = () => {
    setStep((s) => Math.max(s - 1, isEditMode ? 2 : 1));
  };

  const onConfirmSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

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

      <div className="mx-auto w-full max-w-[650px]">
        {/* Stepper row: hidden on step 1, shown on step 2 and ThankYou */}
        {(step !== 1 || isSuccess) ? (
          <div className="h-[145px] pt-[24px]">
            <CustomStepper steps={steps} currentStep={isSuccess ? steps.length : step} />
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
            {isEditMode ? (
              <>
                <h4 className="text-center text-[2.5rem] mt-[20px]">{"\u66f4\u65b0\u6210\u529f!"}</h4>
                <button
                  onClick={() => router.push(props!.editType === "major" ? "/admin/major" : "/admin/study")}
                  className="h-[40px] w-[180px] mt-[35px] rounded-[5px] bg-[var(--color-yellow)] text-black border-none outline-none cursor-pointer"
                >
                  {"\u56de\u5230\u5be9\u67e5\u9801\u9762"}
                </button>
              </>
            ) : (
              <>
                <h4 className="text-center text-[2.5rem] mt-[20px]">{"\u611f\u8b1d\u4f60\u7684\u586b\u5beb!"}</h4>
                <div className="text-center text-[rgba(163,158,158,1)] text-[1.4rem]">{"\u7b49\u5f85\u5be9\u67e5\u901a\u904e\u5f8c\u5c31\u80fd\u770b\u5230\u4f60\u7684\u5fc3\u5f97\u56c9"}</div>
                <div className="text-center text-[rgba(163,158,158,1)] text-[1.4rem]">{"\u82e5\u4e00\u76f4\u6c92\u770b\u5230\u4f60\u7684\u5fc3\u5f97\uff0c\u8acb\u806f\u7d61\u6211\u5011"}</div>
                <button
                  onClick={() => router.push("/")}
                  className="h-[40px] w-[150px] mt-[35px] rounded-[5px] bg-[var(--color-yellow)] text-black border-none outline-none cursor-pointer"
                >
                  {"\u56de\u5230\u5fc3\u5f97\u7e3d\u89bd\u9801\u9762"}
                </button>
              </>
            )}
          </div>
        ) : (
        <form className="mt-0">
          <div className="mx-auto w-[458px] rounded-[5px] bg-white mb-[20px] max-[870px]:w-[80%]">
            {step === 1 && <Step1TypeSelection />}
            {step === 2 && postType === "major" && <Step2MajorForm isAdmin={isAdmin} />}
            {step === 2 && postType === "study" && <Step2StudyForm isAdmin={isAdmin} />}
            {step === 3 && postType === "study" && <Step3StudyForm isAdmin={isAdmin} />}

            <div className={`flex h-[75px] w-full items-center justify-end ${step === 2 && postType === "study" ? "relative -top-[15px]" : ""}`}>
              <button
                type="button"
                onClick={onPrev}
                disabled={step === 1}
                className={`min-w-[100px] h-[40px] rounded-[5px] border-none bg-white text-black outline-none cursor-pointer ${step === 1 || (isEditMode && step === 2) ? "invisible" : ""}`}
                style={{ marginRight: "20px", fontFamily: "Arial", fontSize: "13.3333px", lineHeight: "normal", padding: "1px 6px" }}
              >
                返回
              </button>

              {step === 1 || step === 2 ? (
                <button
                  type="button"
                  onClick={onNext}
                  className="min-w-[100px] h-[40px] rounded-[5px] bg-[var(--color-yellow)] text-black hover:bg-[var(--color-yellow)]/90 border-none outline-none cursor-pointer"
                  style={{ fontFamily: "Arial", fontSize: "13.3333px", lineHeight: "normal", padding: "1px 6px" }}
                >
                  {t("next")}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onNext}
                  className="min-w-[100px] h-[40px] rounded-[5px] bg-[var(--color-yellow)] text-black hover:bg-[var(--color-yellow)]/90 border-none outline-none cursor-pointer"
                  style={{ fontFamily: "Arial", fontSize: "13.3333px", lineHeight: "normal", padding: "1px 6px" }}
                >
                  {t("next")}
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
