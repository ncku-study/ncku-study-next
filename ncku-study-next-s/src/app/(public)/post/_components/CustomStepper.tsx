import { cn } from "@/lib/utils";

interface StepperProps {
  steps: { id: number; title: string }[];
  currentStep: number;
}

export function CustomStepper({ steps, currentStep }: StepperProps) {
  return (
    <div className={cn(
      "mx-auto w-[650px] max-w-full -translate-y-[9px] max-sm:w-full",
      steps.length === 4 && "max-sm:-translate-y-[14.5px]",
    )}>
      <div className="flex items-start bg-white p-[24px]">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const connectorIsCompleted = index > 0 && currentStep > steps[index - 1].id;

          return (
            <div key={step.id} className="relative flex flex-1 px-[8px] max-sm:-translate-y-[0.5px]">
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute z-0"
                  style={{
                    top: 10,
                    left: "calc(-50% + 16px)",
                    right: "calc(50% + 16px)",
                    height: 3,
                    borderTop: `3px solid ${connectorIsCompleted ? "var(--color-yellow)" : "#eaeaf0"}`,
                    borderRadius: 1,
                  }}
                />
              )}

              <div className="relative z-10 flex w-full flex-col items-center">
                <div
                  className={cn(
                    "flex h-[23px] w-[18px] items-center justify-center",
                    isActive || isCompleted ? "text-[var(--color-yellow)]" : "text-[#eaeaf0]",
                  )}
                >
                  {isCompleted ? (
                    <svg
                      className="h-[18px] w-[18px]"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        fill="currentColor"
                        d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                      />
                    </svg>
                  ) : (
                    <div className="h-[8px] w-[8px] rounded-full bg-current" />
                  )}
                </div>

                <div
                  className={cn(
                    "mt-[16px] block w-full text-center",
                    isActive || isCompleted ? "font-medium" : "font-normal",
                  )}
                  style={{
                    color: isActive || isCompleted ? "rgba(0, 0, 0, 0.87)" : "rgba(0, 0, 0, 0.54)",
                    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                    fontSize: 8.75,
                    lineHeight: "12.5125px",
                    letterSpacing: "0.0937125px",
                  }}
                >
                  {step.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
