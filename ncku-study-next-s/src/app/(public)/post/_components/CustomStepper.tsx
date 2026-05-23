import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepperProps {
  steps: { id: number; title: string }[];
  currentStep: number;
}

export function CustomStepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="relative mb-12 flex w-full justify-between px-4">
      {/* Background Line */}
      <div className="absolute top-1/2 left-0 h-1 w-full -translate-y-1/2 rounded bg-muted/50 px-8" />
      
      {/* Active Line (Dynamic width based on step) */}
      <div
        className="absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded bg-primary px-8 transition-all duration-300"
        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
      />

      {steps.map((step, idx) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;

        return (
          <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors duration-300",
                isCompleted
                  ? "border-primary bg-primary text-primary-foreground"
                  : isActive
                  ? "border-primary bg-background text-primary"
                  : "border-muted bg-background text-muted-foreground"
              )}
            >
              {isCompleted ? <Check className="h-5 w-5" /> : step.id}
            </div>
            <div
              className={cn(
                "absolute -bottom-8 w-max text-sm font-medium transition-colors duration-300",
                isActive || isCompleted ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {step.title}
            </div>
          </div>
        );
      })}
    </div>
  );
}
