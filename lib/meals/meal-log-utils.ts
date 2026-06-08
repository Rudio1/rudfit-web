import type { MealLog } from "@/lib/types/meals";
import type { MacroTotals } from "@/lib/meals/macros";

export function mealLogToMacroTotals(meal: MealLog): MacroTotals {
  return {
    calories: meal.totalCalories,
    protein: meal.totalProtein,
    carbs: meal.totalCarbs,
    fat: meal.totalFat,
    grams: meal.items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

export interface EditableMealItem {
  id: string;
  name: string;
  estimatedQuantityGrams: number;
}

export function mealLogToEditableItems(meal: MealLog): EditableMealItem[] {
  return meal.items.map((item) => ({
    id: item.id,
    name: item.foodName,
    estimatedQuantityGrams: item.quantity,
  }));
}

export function formatMealTime(value: string): string {
  return new Date(value).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatMealDateTime(value: string): string {
  return new Date(value).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatMacroValue(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}
