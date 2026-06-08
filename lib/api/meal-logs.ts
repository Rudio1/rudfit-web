import { api, apiForm } from "@/lib/api/client";
import type {
  AnalyzedMealResponse,
  DailyConsumptionSummary,
  DetectedFood,
  MealLog,
  MealType,
} from "@/lib/types/meals";

export async function analyzePhoto(image: File): Promise<AnalyzedMealResponse> {
  const formData = new FormData();
  formData.append("image", image);
  return apiForm<AnalyzedMealResponse>("/meal-logs/analyze-photo", formData);
}

export async function estimateDetectedFoodsNutrition(
  foods: DetectedFood[],
): Promise<AnalyzedMealResponse> {
  return api<AnalyzedMealResponse>(
    "/meal-logs/estimate-detected-foods-nutrition",
    {
      method: "POST",
      body: JSON.stringify({
        foods: foods.map((food) => ({
          name: food.name,
          estimatedQuantityGrams: food.estimatedQuantityGrams,
        })),
      }),
    },
  );
}

export async function saveFromDetectedFoods(input: {
  mealType: MealType;
  consumedAtUtc: string;
  foods: DetectedFood[];
}): Promise<MealLog> {
  return api<MealLog>("/meal-logs/from-detected-foods", {
    method: "POST",
    body: JSON.stringify({
      mealType: input.mealType,
      consumedAtUtc: input.consumedAtUtc,
      foods: input.foods.map((food) => ({
        foodId: food.foodId,
        estimatedQuantityGrams: food.estimatedQuantityGrams,
      })),
    }),
  });
}

export async function listMealLogsByDate(date: string): Promise<MealLog[]> {
  return api<MealLog[]>(`/meal-logs?date=${date}`);
}

export async function getMealLogByDateAndId(
  date: string,
  mealLogId: string,
): Promise<MealLog | null> {
  const logs = await listMealLogsByDate(date);
  return logs.find((log) => log.id === mealLogId) ?? null;
}

export interface UpdateMealLogItemInput {
  id?: string;
  name: string;
  estimatedQuantityGrams: number;
}

export interface UpdateMealLogInput {
  name?: string;
  mealType: MealType;
  items: UpdateMealLogItemInput[];
}

export async function updateMealLog(
  mealLogId: string,
  input: UpdateMealLogInput,
): Promise<MealLog> {
  return api<MealLog>(`/meal-logs/${mealLogId}`, {
    method: "PUT",
    body: JSON.stringify({
      name: input.name,
      mealType: input.mealType,
      items: input.items.map((item) => ({
        id: item.id,
        name: item.name,
        estimatedQuantityGrams: item.estimatedQuantityGrams,
      })),
    }),
  });
}

export async function getDailySummary(
  date: string,
): Promise<DailyConsumptionSummary> {
  return api<DailyConsumptionSummary>(`/meal-logs/daily-summary?date=${date}`);
}
