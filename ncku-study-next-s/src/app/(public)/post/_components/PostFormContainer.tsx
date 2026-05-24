"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CustomStepper } from "./CustomStepper";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { CheckCircle2, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { Step1TypeSelection } from "./Step1TypeSelection";
import { Step2MajorForm } from "./Step2MajorForm";
import { Step2StudyForm } from "./Step2StudyForm";
import { Step3Preview } from "./Step3Preview";

export function PostFormContainer() {
  const t = useTranslations("post");
  const tCommon = useTranslations("common");

  // Schemas
  const step1Schema = z.object({
    postType: z.enum(["major", "study"], {
      message: t("selectType"),
    }),
  });

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
  const [isSuccess, setIsSuccess] = useState(false);

  const methods = useForm({
    mode: "onTouched",
    defaultValues: {
      postType: undefined,
      category: "",
      rank_1: "",
      rank_2: "",
      year: new Date().getFullYear(),
      score: "",
      isPass: "pass",
      out_maj: "",
      in_maj: "",
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
      setIsSuccess(true);
    },
  });

  const onNext = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await trigger("postType", { shouldFocus: true });
    } else if (step === 2) {
      const schema = postType === "major" ? majorSchema : studySchema;
      const values = methods.getValues();
      const result = schema.safeParse(values);
      if (!result.success) {
        // Trigger validation for all fields in the current step
        if (postType === "major") {
          isValid = await trigger(["category", "rank_1", "rank_2", "year", "score", "isPass", "out_maj", "in_maj", "department", "comment"]);
        } else {
          isValid = await trigger(["title", "content", "year", "major", "studyCategories"]);
        }
      } else {
        isValid = true;
      }
    }

    if (isValid) {
      setStep((s) => Math.min(s + 1, 3));
    }
  };

  const onPrev = () => {
    setStep((s) => Math.max(s - 1, 1));
  };

  const onSubmit = (data: any) => {
    if (step === 3) {
      mutation.mutate(data);
    }
  };

  const resetForm = () => {
    reset();
    setStep(1);
    setIsSuccess(false);
  };

  if (isSuccess) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center">
        <CheckCircle2 className="mb-4 h-16 w-16 text-green-500" />
        <h2 className="mb-2 text-2xl font-bold">{t("success")}</h2>
        <p className="mb-6 text-muted-foreground">{t("successMsg")}</p>
        <Button onClick={resetForm}>{t("submitAnother")}</Button>
      </Card>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <CustomStepper steps={steps} currentStep={step} />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
          <Card className="p-6">
            {step === 1 && <Step1TypeSelection />}
            {step === 2 && postType === "major" && <Step2MajorForm />}
            {step === 2 && postType === "study" && <Step2StudyForm />}
            {step === 3 && <Step3Preview />}

            <div className="mt-8 flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={onPrev}
                disabled={step === 1 || mutation.isPending}
                className={step === 1 ? "invisible" : ""}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                {t("back")}
              </Button>
              
              {step < 3 ? (
                <Button type="button" onClick={onNext}>
                  {t("next")}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? tCommon("loading") : t("submit")}
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </Card>
        </form>
      </FormProvider>
    </div>
  );
}
