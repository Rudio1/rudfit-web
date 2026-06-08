export enum MealType {
  Breakfast = 1,
  Lunch = 2,
  Dinner = 3,
  Snack = 4,
  PreWorkout = 5,
  PostWorkout = 6,
}

export interface DetectedFood {
  name: string;
  estimatedQuantityGrams: number;
  foodId?: string | null;
  caloriesKcal?: number | null;
  carbohydratesGrams?: number | null;
  fatGrams?: number | null;
  proteinGrams?: number | null;
}

export interface AnalyzedMealResponse {
  foods: DetectedFood[];
}

export interface MealLogItem {
  id: string;
  foodId: string;
  foodName: string;
  quantity: number;
  unitType: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealLog {
  id: string;
  name: string;
  mealType: MealType;
  sourceType: number;
  consumedAt: string;
  notes: string | null;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  items: MealLogItem[];
}

export interface DailyConsumptionSummary {
  date: string;
  mealsCount: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}
