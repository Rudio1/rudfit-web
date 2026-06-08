import { formatMacroValue } from "@/lib/meals/meal-log-utils";
import type { MealLogItem } from "@/lib/types/meals";

interface MealLogItemCardProps {
  item: MealLogItem;
  index: number;
}

export function MealLogItemCard({ item, index }: MealLogItemCardProps) {
  return (
    <article className="surface-card overflow-hidden">
      <div className="border-b border-border bg-muted/30 px-4 py-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary">
              {index}
            </span>
            <div>
              <p className="font-medium">{item.foodName}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {formatMacroValue(item.quantity)} g
              </p>
            </div>
          </div>
          <p className="shrink-0 text-sm font-semibold tabular-nums text-primary">
            {item.calories} kcal
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 divide-x divide-border px-2 py-3 text-center text-xs">
        <div>
          <p className="text-muted-foreground">Proteína</p>
          <p className="mt-1 font-semibold tabular-nums text-macro-protein">
            {formatMacroValue(item.protein)} g
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Carboidratos</p>
          <p className="mt-1 font-semibold tabular-nums text-macro-carbs">
            {formatMacroValue(item.carbs)} g
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Gorduras</p>
          <p className="mt-1 font-semibold tabular-nums text-macro-fat">
            {formatMacroValue(item.fat)} g
          </p>
        </div>
      </div>
    </article>
  );
}
