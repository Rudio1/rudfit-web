import { cn } from "@/lib/utils";
import { MEAL_TYPE_OPTIONS } from "@/lib/meals/constants";
import type { MealType } from "@/lib/types/meals";
import { MealTypeImage } from "@/components/meals/meal-type-image";

interface MealTypePickerProps {
  value: MealType | null;
  onChange: (value: MealType) => void;
}

export function MealTypePicker({ value, onChange }: MealTypePickerProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4">
      {MEAL_TYPE_OPTIONS.map((option) => {
        const selected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "action-link overflow-hidden rounded-xl border text-left transition-all",
              selected
                ? "border-primary shadow-xs ring-1 ring-primary/20"
                : "border-border bg-card hover:border-primary/30 hover:shadow-xs",
            )}
          >
            <MealTypeImage
              mealType={option.value}
              alt={option.label}
              className="aspect-[4/3] w-full"
              sizes="(max-width: 640px) 50vw, 160px"
            />
            <span
              className={cn(
                "block px-3 py-2.5 text-sm font-medium",
                selected ? "bg-primary/10 text-foreground" : "text-foreground",
              )}
            >
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
