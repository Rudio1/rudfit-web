import { MealType } from "@/lib/types/meals";

export const MEAL_TYPE_OPTIONS = [
  {
    value: MealType.Breakfast,
    label: "Café da manhã",
    imageSrc: "/img-refeicoes/cafe-da-manha.png",
  },
  {
    value: MealType.Lunch,
    label: "Almoço",
    imageSrc: "/img-refeicoes/almoco.png",
  },
  {
    value: MealType.Dinner,
    label: "Jantar",
    imageSrc: "/img-refeicoes/jantar.png",
  },
  {
    value: MealType.Snack,
    label: "Lanche",
    imageSrc: "/img-refeicoes/lanche.png",
  },
  {
    value: MealType.PreWorkout,
    label: "Pré-treino",
    imageSrc: "/img-refeicoes/pre-treino.png",
  },
  {
    value: MealType.PostWorkout,
    label: "Pós-treino",
    imageSrc: "/img-refeicoes/pos-treino.png",
  },
] as const;

export function getMealTypeLabel(value: MealType): string {
  return (
    MEAL_TYPE_OPTIONS.find((option) => option.value === value)?.label ??
    "Refeição"
  );
}

export function getMealTypeImage(value: MealType): string {
  return (
    MEAL_TYPE_OPTIONS.find((option) => option.value === value)?.imageSrc ??
    "/img-refeicoes/lanche.png"
  );
}

export { formatDateParam } from "@/lib/meals/dates";
