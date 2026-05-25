import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepperProps {
  steps: { id: number; title: string }[];
  currentStep: number;
}

export function CustomStepper({ steps, currentStep }: StepperProps) {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="relative mx-auto mb-7.5 w-[458px] max-w-full max-[870px]:w-[80%]">
      <div className="absolute top-2.5 left-6 right-6 h-0.75 rounded bg-[#d9dbe0]" />
      <div
        className="absolute top-2.5 left-6 h-0.75 rounded bg-[var(--color-yellow)] transition-all duration-300"
        style={{ width: `calc((100% - 48px) * ${progress / 100})` }}
      />

      <div className="relative flex items-start justify-between">
        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <div key={step.id} className="flex w-[140px] max-[870px]:w-[90px] flex-col items-center">
              <div className={cn("flex h-5 w-5 items-center justify-center", isActive || isCompleted ? "text-[var(--color-yellow)]" : "text-[#d9dbe0]")}>
                {isCompleted ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <div className="h-2 w-2 rounded-full bg-current" />}
              </div>
              <div className={cn("mt-0.5 text-[9px] font-normal leading-none", isActive || isCompleted ? "text-[var(--color-light-black)]" : "text-[#a4a8b0]")}>
                {step.title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
