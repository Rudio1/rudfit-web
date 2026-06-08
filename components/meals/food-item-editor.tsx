import { PencilLine, Trash2 } from "lucide-react";
import type { DetectedFood } from "@/lib/types/meals";
import { formatMacro } from "@/lib/meals/macros";
import { messageService } from "@/lib/services/message-service";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FoodItemEditorProps {
  food: DetectedFood;
  index: number;
  onChange: (index: number, food: DetectedFood) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export function FoodItemEditor({
  food,
  index,
  onChange,
  onRemove,
  canRemove,
}: FoodItemEditorProps) {
  const needsRecalculation = food.caloriesKcal == null;

  function update(partial: Partial<DetectedFood>) {
    const next = { ...food, ...partial };
    if ("name" in partial || "estimatedQuantityGrams" in partial) {
      next.foodId = null;
      next.caloriesKcal = null;
      next.proteinGrams = null;
      next.carbohydratesGrams = null;
      next.fatGrams = null;
    }
    onChange(index, next);
  }

  async function handleRemove() {
    const confirmed = await messageService.confirmRemove({
      itemLabel: food.name.trim() || "este item",
    });
    if (!confirmed) return;
    onRemove(index);
  }

  return (
    <article
      className={cn(
        "overflow-hidden rounded-xl border bg-card shadow-xs transition-shadow focus-within:shadow-sm",
        needsRecalculation
          ? "border-warning/40 ring-1 ring-warning/10"
          : "border-primary/20 ring-1 ring-primary/5",
      )}
    >
      <header className="flex items-center justify-between gap-3 border-b border-border bg-muted/30 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary">
            {index + 1}
          </span>
          <span className="text-sm font-medium">Item da refeição</span>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
          <PencilLine className="size-3" aria-hidden />
          Editável
        </span>
      </header>

      <div className="space-y-4 p-4">
        <div className="rounded-lg border border-dashed border-primary/25 bg-primary/[0.03] p-4">
          <p className="mb-3 text-xs font-medium text-primary">
            Toque nos campos abaixo para corrigir nome ou quantidade
          </p>

          <div className="grid gap-4 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)]">
            <div className="space-y-2">
              <Label
                htmlFor={`food-name-${index}`}
                className="flex items-center gap-1.5 text-foreground"
              >
                <PencilLine className="size-3.5 text-muted-foreground" aria-hidden />
                Nome do alimento
              </Label>
              <Input
                id={`food-name-${index}`}
                className="h-10 border-primary/20 bg-background shadow-xs focus-visible:border-primary focus-visible:ring-primary/20"
                placeholder="Ex.: arroz branco, frango grelhado..."
                value={food.name}
                onChange={(e) => update({ name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor={`food-grams-${index}`}
                className="flex items-center gap-1.5 text-foreground"
              >
                <PencilLine className="size-3.5 text-muted-foreground" aria-hidden />
                Quantidade
              </Label>
              <div className="relative">
                <Input
                  id={`food-grams-${index}`}
                  className="h-10 border-primary/20 bg-background pr-10 shadow-xs focus-visible:border-primary focus-visible:ring-primary/20"
                  inputMode="decimal"
                  placeholder="100"
                  value={food.estimatedQuantityGrams || ""}
                  onChange={(e) =>
                    update({
                      estimatedQuantityGrams: Number(e.target.value) || 0,
                    })
                  }
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm font-medium text-muted-foreground">
                  g
                </span>
              </div>
            </div>
          </div>
        </div>

        {food.caloriesKcal != null ? (
          <div className="rounded-lg border border-border bg-card-elevated/80 px-3 py-3">
            <p className="text-xs font-medium text-muted-foreground">
              Nutrientes estimados para esta quantidade
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
              <MacroPill
                label="Calorias"
                value={formatMacro(food.caloriesKcal, " kcal")}
              />
              <MacroPill
                label="Proteína"
                value={formatMacro(food.proteinGrams ?? 0, " g")}
              />
              <MacroPill
                label="Carboidratos"
                value={formatMacro(food.carbohydratesGrams ?? 0, " g")}
              />
              <MacroPill
                label="Gorduras"
                value={formatMacro(food.fatGrams ?? 0, " g")}
              />
            </div>
          </div>
        ) : (
          <p className="rounded-lg border border-warning/30 bg-warning/5 px-3 py-2.5 text-xs text-foreground">
            <span className="font-medium text-warning">Alteração detectada.</span>{" "}
            Os nutrientes deste item serão recalculados ao confirmar a refeição.
          </p>
        )}
      </div>

      {canRemove ? (
        <footer className="border-t border-border bg-muted/20 px-4 py-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 text-muted-foreground hover:text-destructive"
            onClick={handleRemove}
          >
            <Trash2 className="size-3.5" />
            Remover item
          </Button>
        </footer>
      ) : null}
    </article>
  );
}

function MacroPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-background/80 px-2 py-1.5">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="font-semibold tabular-nums">{value}</p>
    </div>
  );
}
