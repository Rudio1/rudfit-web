import { formatMacroValue } from "@/lib/meals/progress";
import { getDailyGoalsBreakdown } from "@/lib/goals/daily-goals";
import type { DailyGoalsResponse } from "@/lib/types/onboarding";
import { formatMacro } from "@/lib/meals/macros";

interface MacroGoalsSectionProps {
  goals: DailyGoalsResponse;
}

export function MacroGoalsSection({ goals }: MacroGoalsSectionProps) {
  const breakdown = getDailyGoalsBreakdown(goals);

  return (
    <div className="grid gap-4">
      {breakdown.map((segment) => (
        <div
          key={segment.key}
          className="rounded-lg border border-border/60 bg-card-elevated/50 p-4"
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium">{segment.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {segment.percent}% das calorias da meta
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold tabular-nums">
                {formatMacroValue(segment.grams)} g
              </p>
              <p className="text-xs tabular-nums text-muted-foreground">
                {formatMacro(segment.calories, " kcal")}
              </p>
            </div>
          </div>
          <div
            className="h-2.5 w-full overflow-hidden rounded-full border border-border/80"
            style={{ backgroundColor: `var(${segment.trackColorVar})` }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.max(segment.percent, segment.percent > 0 ? 8 : 0)}%`,
                backgroundColor: `var(${segment.colorVar})`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
