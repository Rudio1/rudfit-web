import { cn } from "@/lib/utils";
import { ONBOARDING_STEPS } from "@/lib/onboarding/steps";

interface OnboardingStepIndicatorProps {
  currentStep: number;
  className?: string;
}

export function OnboardingStepIndicator({
  currentStep,
  className,
}: OnboardingStepIndicatorProps) {
  const current = ONBOARDING_STEPS[currentStep];

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-caption font-medium uppercase tracking-wider text-primary">
            {current.group}
          </p>
          <p className="mt-0.5 truncate text-sm font-medium text-foreground">
            {current.shortLabel}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-medium tabular-nums text-muted-foreground">
          {currentStep + 1}/{ONBOARDING_STEPS.length}
        </span>
      </div>

      <div className="flex gap-1.5">
        {ONBOARDING_STEPS.map((step, index) => {
          const isComplete = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div
              key={step.id}
              className="flex-1"
              aria-hidden={!isCurrent}
              aria-current={isCurrent ? "step" : undefined}
            >
              <div
                className={cn(
                  "h-1.5 rounded-full transition-colors duration-300",
                  isComplete && "bg-primary",
                  isCurrent && "bg-primary/70",
                  !isComplete && !isCurrent && "bg-muted",
                )}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
