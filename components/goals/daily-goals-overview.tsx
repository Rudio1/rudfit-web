"use client";

import { Flame, TrendingDown, TrendingUp } from "lucide-react";
import {
  dailyGoalsToMacroTotals,
  formatGoalDelta,
  getDailyGoalsBreakdown,
} from "@/lib/goals/daily-goals";
import { formatMacroValue } from "@/lib/meals/progress";
import type { DailyGoalsResponse } from "@/lib/types/onboarding";
import { DailyGoalCalorieRing } from "@/components/goals/daily-goal-calorie-ring";
import { MacroGoalsSection } from "@/components/goals/macro-goals-section";
import { MealMacroDonutChart } from "@/components/meals/meal-macro-donut-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { cn } from "@/lib/utils";

interface DailyGoalsOverviewProps {
  goals: DailyGoalsResponse;
  previousGoals?: DailyGoalsResponse | null;
  showStats?: boolean;
  className?: string;
}

function deltaHint(
  current: number,
  previous: number | undefined,
  unit: string,
): string | undefined {
  if (previous === undefined) return undefined;
  const delta = Math.round(current - previous);
  if (delta === 0) return "Igual à meta anterior";
  return `${formatGoalDelta(current, previous)} ${unit} vs anterior`;
}

function deltaTrend(
  current: number,
  previous: number | undefined,
): "neutral" | "success" | "warning" {
  if (previous === undefined) return "neutral";
  const delta = current - previous;
  if (delta === 0) return "neutral";
  return delta > 0 ? "warning" : "success";
}

export function DailyGoalsOverview({
  goals,
  previousGoals,
  showStats = false,
  className,
}: DailyGoalsOverviewProps) {
  const breakdown = getDailyGoalsBreakdown(goals);
  const macroTotals = dailyGoalsToMacroTotals(goals);
  const proteinShare =
    breakdown.find((segment) => segment.key === "protein")?.percent ?? 0;

  return (
    <div className={cn("section-stack", className)}>
      {showStats ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Calorias / dia"
            value={`${Math.round(goals.dailyCaloriesGoal)} kcal`}
            hint={deltaHint(
              goals.dailyCaloriesGoal,
              previousGoals?.dailyCaloriesGoal,
              "kcal",
            )}
            icon={Flame}
            trend={deltaTrend(
              goals.dailyCaloriesGoal,
              previousGoals?.dailyCaloriesGoal,
            )}
          />
          <StatCard
            label="Proteína / dia"
            value={`${formatMacroValue(goals.dailyProteinGoal)} g`}
            hint={
              deltaHint(
                goals.dailyProteinGoal,
                previousGoals?.dailyProteinGoal,
                "g",
              ) ?? `${proteinShare}% das calorias`
            }
            trend={deltaTrend(
              goals.dailyProteinGoal,
              previousGoals?.dailyProteinGoal,
            )}
          />
          <StatCard
            label="Carboidratos / dia"
            value={`${formatMacroValue(goals.dailyCarbsGoal)} g`}
            hint={deltaHint(
              goals.dailyCarbsGoal,
              previousGoals?.dailyCarbsGoal,
              "g",
            )}
            trend={deltaTrend(
              goals.dailyCarbsGoal,
              previousGoals?.dailyCarbsGoal,
            )}
          />
          <StatCard
            label="Gorduras / dia"
            value={`${formatMacroValue(goals.dailyFatGoal)} g`}
            hint={deltaHint(
              goals.dailyFatGoal,
              previousGoals?.dailyFatGoal,
              "g",
            )}
            trend={deltaTrend(
              goals.dailyFatGoal,
              previousGoals?.dailyFatGoal,
            )}
          />
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <Card className="shadow-xs">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-section-title">Meta calórica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <DailyGoalCalorieRing calories={goals.dailyCaloriesGoal} />
            {previousGoals ? (
              <GoalDeltaBanner
                current={goals.dailyCaloriesGoal}
                previous={previousGoals.dailyCaloriesGoal}
                unit="kcal"
              />
            ) : (
              <p className="text-center text-sm text-muted-foreground">
                Este é o total de calorias recomendado para o seu plano diário.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-section-title">
              Distribuição de macros
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <MealMacroDonutChart totals={macroTotals} />
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-xs">
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="text-section-title">
            Metas por macronutriente
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <MacroGoalsSection goals={goals} />
        </CardContent>
      </Card>
    </div>
  );
}

function GoalDeltaBanner({
  current,
  previous,
  unit,
}: {
  current: number;
  previous: number;
  unit: string;
}) {
  const delta = Math.round(current - previous);
  const increased = delta > 0;
  const decreased = delta < 0;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border px-4 py-3",
        increased && "border-warning/30 bg-warning/5",
        decreased && "border-primary/30 bg-primary/5",
        !increased && !decreased && "border-border bg-muted/40",
      )}
    >
      {increased ? (
        <TrendingUp className="size-5 shrink-0 text-warning" aria-hidden />
      ) : decreased ? (
        <TrendingDown className="size-5 shrink-0 text-primary" aria-hidden />
      ) : null}
      <div>
        <p className="text-sm font-medium">
          {delta === 0
            ? "Calorias mantidas em relação ao plano anterior"
            : `${formatGoalDelta(current, previous)} ${unit} em relação ao plano anterior`}
        </p>
        <p className="text-xs text-muted-foreground">
          Antes: {Math.round(previous)} {unit} · Agora: {Math.round(current)}{" "}
          {unit}
        </p>
      </div>
    </div>
  );
}
