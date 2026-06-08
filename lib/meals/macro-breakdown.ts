import type { MacroTotals } from "@/lib/meals/macros";

export interface MacroBreakdownSegment {
  key: "protein" | "carbs" | "fat";
  label: string;
  grams: number;
  calories: number;
  percent: number;
  colorVar: string;
  trackColorVar: string;
}

const MACRO_META = [
  {
    key: "protein" as const,
    label: "Proteína",
    colorVar: "--macro-protein",
    trackColorVar: "--macro-protein-track",
    caloriesPerGram: 4,
  },
  {
    key: "carbs" as const,
    label: "Carboidratos",
    colorVar: "--macro-carbs",
    trackColorVar: "--macro-carbs-track",
    caloriesPerGram: 4,
  },
  {
    key: "fat" as const,
    label: "Gorduras",
    colorVar: "--macro-fat",
    trackColorVar: "--macro-fat-track",
    caloriesPerGram: 9,
  },
];

export function getMacroBreakdown(totals: MacroTotals): MacroBreakdownSegment[] {
  const grams = {
    protein: totals.protein,
    carbs: totals.carbs,
    fat: totals.fat,
  };

  const calories = MACRO_META.map(
    (macro) => grams[macro.key] * macro.caloriesPerGram,
  );
  const totalCalories = calories.reduce((sum, value) => sum + value, 0) || 1;

  return MACRO_META.map((macro, index) => ({
    key: macro.key,
    label: macro.label,
    grams: grams[macro.key],
    calories: calories[index]!,
    percent: Math.round((calories[index]! / totalCalories) * 100),
    colorVar: macro.colorVar,
    trackColorVar: macro.trackColorVar,
  }));
}

export function getMacroDonutSegments(
  breakdown: MacroBreakdownSegment[],
): Array<{ percent: number; colorVar: string }> {
  return breakdown
    .filter((segment) => segment.percent > 0)
    .map((segment) => ({
      percent: segment.percent,
      colorVar: segment.colorVar,
    }));
}
