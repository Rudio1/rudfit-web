import { Info, PencilLine, Plus } from "lucide-react";
import { getMealTypeLabel } from "@/lib/meals/constants";
import { formatMacro, type MacroTotals } from "@/lib/meals/macros";
import type { DetectedFood } from "@/lib/types/meals";
import type { MealType } from "@/lib/types/meals";
import { FoodItemEditor } from "@/components/meals/food-item-editor";
import { MealMacroDonutChart } from "@/components/meals/meal-macro-donut-chart";
import { MealTypeImage } from "@/components/meals/meal-type-image";
import { Alert } from "@/components/ui/alert";
import { ActionBar } from "@/components/ui/action-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MealConfirmPanelProps {
  mealType: MealType;
  previewUrl: string | null;
  foods: DetectedFood[];
  macroTotals: MacroTotals;
  saving: boolean;
  onUpdateFood: (index: number, food: DetectedFood) => void;
  onRemoveFood: (index: number) => void;
  onAddFood: () => void;
  onSave: () => void;
}

export function MealConfirmPanel({
  mealType,
  previewUrl,
  foods,
  macroTotals,
  saving,
  onUpdateFood,
  onRemoveFood,
  onAddFood,
  onSave,
}: MealConfirmPanelProps) {
  const mealLabel = getMealTypeLabel(mealType);

  return (
    <div className="space-y-5">
      <Alert variant="info" icon={Info} title="Revise antes de salvar">
        A IA sugere nomes e quantidades, mas você pode{" "}
        <span className="font-medium text-foreground">
          editar qualquer campo
        </span>{" "}
        abaixo. Corrija o que não bater com o prato real — os macros são
        recalculados ao confirmar.
      </Alert>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Card className="overflow-hidden shadow-xs">
            <div className="grid sm:grid-cols-[140px_1fr] xl:grid-cols-1">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Foto da refeição"
                  className="h-36 w-full border-b border-border object-cover sm:h-full sm:border-b-0 sm:border-r xl:h-44 xl:border-b xl:border-r-0"
                />
              ) : (
                <MealTypeImage
                  mealType={mealType}
                  alt={mealLabel}
                  className="h-36 w-full border-b border-border sm:h-full sm:min-h-[140px] sm:border-b-0 sm:border-r xl:h-44 xl:border-b xl:border-r-0"
                  sizes="140px"
                />
              )}
              <CardContent className="flex flex-col justify-center gap-2 py-4">
                <p className="text-xs font-medium uppercase tracking-wide text-primary">
                  Análise concluída
                </p>
                <p className="text-lg font-semibold">{mealLabel}</p>
                <p className="text-sm text-muted-foreground">
                  {foods.length}{" "}
                  {foods.length === 1
                    ? "item identificado"
                    : "itens identificados"}
                  {" · "}
                  {formatMacro(macroTotals.calories, " kcal")}
                </p>
              </CardContent>
            </div>
          </Card>

          <Card className="shadow-xs">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="text-section-title">
                Resumo nutricional
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <MealMacroDonutChart totals={macroTotals} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-primary/20 bg-primary/[0.03] px-4 py-3">
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <PencilLine className="size-4" aria-hidden />
              </span>
              <div>
                <h2 className="text-section-title">Alimentos e quantidades</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Campos destacados em verde são editáveis. Ajuste nome e peso
                  em gramas de cada item.
                </p>
              </div>
            </div>
            <span className="rounded-full bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border">
              {foods.length} {foods.length === 1 ? "item" : "itens"}
            </span>
          </div>

          <div className="space-y-3">
            {foods.map((food, index) => (
              <FoodItemEditor
                key={index}
                food={food}
                index={index}
                onChange={onUpdateFood}
                onRemove={onRemoveFood}
                canRemove={foods.length > 1}
              />
            ))}
          </div>

          <ActionBar variant="footer">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onAddFood}
            >
              <Plus className="size-4" />
              Adicionar item manualmente
            </Button>

            <Button
              type="button"
              disabled={saving}
              size="lg"
              className="shadow-sm"
              onClick={onSave}
            >
              {saving ? "Salvando refeição..." : "Confirmar e salvar refeição"}
            </Button>
          </ActionBar>
        </div>
      </div>
    </div>
  );
}
