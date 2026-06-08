import type { DetectedFood } from "@/lib/types/meals";

export interface MacroTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  grams: number;
}

export function sumFoodMacros(foods: DetectedFood[]): MacroTotals {
  return foods.reduce(
    (totals, food) => ({
      calories: totals.calories + (food.caloriesKcal ?? 0),
      protein: totals.protein + (food.proteinGrams ?? 0),
      carbs: totals.carbs + (food.carbohydratesGrams ?? 0),
      fat: totals.fat + (food.fatGrams ?? 0),
      grams: totals.grams + food.estimatedQuantityGrams,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, grams: 0 },
  );
}

export function formatMacro(value: number, suffix = ""): string {
  const rounded = Math.round(value * 10) / 10;
  return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(1)}${suffix}`;
}
