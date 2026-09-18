import { cn } from "@/lib/utils";

interface StepperProps {
  steps: { id: number; title: string }[];
  currentStep: number;
}

export function CustomStepper({ steps, currentStep }: StepperProps) {
  return (
    <div className={cn(
      "mx-auto w-260 max-w-full -translate-y-4 max-sm:w-full",
      steps.length === 4 && "max-sm:-translate-y-6",
    )}>
      <div className="flex items-start bg-white p-10" style={{ padding: "24px" }}>
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const connectorIsCompleted = index > 0 && currentStep > steps[index - 1].id;

          return (
            <div
              key={step.id}
              className="relative flex flex-1 px-3 max-sm:-translate-y-px"
              style={{ paddingLeft: "8px", paddingRight: "8px" }}
            >
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute z-0"
                  style={{
                    top: 10,
                    left: "calc(-50% + 16px)",
                    right: "calc(50% + 16px)",
                    height: 3,
                    borderTop: `3px solid ${connectorIsCompleted ? "var(--color-yellow)" : "var(--color-stepper-inactive)"}`,
                    borderRadius: 1,
                  }}
                />
              )}

              <div className="relative z-10 flex w-full flex-col items-center">
                <div
                  className={cn(
                    "flex h-9 w-7 items-center justify-center",
                    isActive || isCompleted ? "text-yellow" : "text-stepper-inactive",
                  )}
                  style={{ width: "18px", height: "23px" }}
                >
                  {isCompleted ? (
                    <svg
                      className="h-7 w-7"
                      style={{ width: "18px", height: "18px" }}
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
                    <div className="h-3 w-3 rounded-full bg-current" style={{ width: "8px", height: "8px" }} />
                  )}
                </div>

                <div
                  className={cn(
                    "mt-6 block w-full text-center",
                    isActive || isCompleted ? "font-medium" : "font-normal",
                  )}
                  style={{
                    color: isActive || isCompleted ? "var(--color-form-value)" : "var(--color-form-label)",
                    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                    fontSize: 8.75,
                    lineHeight: "12.5125px",
                    marginTop: "16px",
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
