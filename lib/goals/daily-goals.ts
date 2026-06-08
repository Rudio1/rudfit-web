import { getMacroBreakdown } from "@/lib/meals/macro-breakdown";
import type { MacroTotals } from "@/lib/meals/macros";
import type { DailyGoalsResponse } from "@/lib/types/onboarding";

export function dailyGoalsToMacroTotals(
  goals: DailyGoalsResponse,
): MacroTotals {
  return {
    calories: goals.dailyCaloriesGoal,
    protein: goals.dailyProteinGoal,
    carbs: goals.dailyCarbsGoal,
    fat: goals.dailyFatGoal,
    grams: 0,
  };
}

export function getDailyGoalsBreakdown(goals: DailyGoalsResponse) {
  return getMacroBreakdown(dailyGoalsToMacroTotals(goals));
}

export function formatGoalDelta(current: number, previous: number): string {
  const delta = Math.round(current - previous);
  if (delta === 0) return "Sem alteração";
  return `${delta > 0 ? "+" : ""}${delta}`;
}

export interface RecalculateGoalsPayload {
  current: DailyGoalsResponse;
  previous: DailyGoalsResponse | null;
}

export function parseRecalculateGoalsPayload(
  raw: string,
): RecalculateGoalsPayload | null {
  try {
    const parsed = JSON.parse(raw) as
      | RecalculateGoalsPayload
      | DailyGoalsResponse;

    if ("current" in parsed && parsed.current) {
      return {
        current: parsed.current,
        previous: parsed.previous ?? null,
      };
    }

    const legacy = parsed as DailyGoalsResponse;
    if (
      typeof legacy.dailyCaloriesGoal === "number" &&
      typeof legacy.dailyProteinGoal === "number"
    ) {
      return { current: legacy, previous: null };
    }

    return null;
  } catch {
    return null;
  }
}
