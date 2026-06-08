"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Clock, PencilLine, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import {
  getMealLogByDateAndId,
  updateMealLog,
} from "@/lib/api/meal-logs";
import { ApiError } from "@/lib/api/errors";
import { getMealTypeLabel } from "@/lib/meals/constants";
import { formatDateParam, parseDateParam, startOfDay } from "@/lib/meals/dates";
import {
  formatMealDateTime,
  formatMealTime,
  mealLogToEditableItems,
  mealLogToMacroTotals,
  type EditableMealItem,
} from "@/lib/meals/meal-log-utils";
import type { MealLog } from "@/lib/types/meals";
import type { MealType } from "@/lib/types/meals";
import { PageScaffold } from "@/components/layout/page-scaffold";
import { MealLogItemCard } from "@/components/meals/meal-log-item-card";
import { MealLogItemEditor } from "@/components/meals/meal-log-item-editor";
import { MealMacroDonutChart } from "@/components/meals/meal-macro-donut-chart";
import { MealTypeImage } from "@/components/meals/meal-type-image";
import { MealTypePicker } from "@/components/meals/meal-type-picker";
import { Alert } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { ActionBar } from "@/components/ui/action-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface MealLogDetailPageProps {
  mealId: string;
}

export function MealLogDetailPage({ mealId }: MealLogDetailPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam =
    searchParams.get("date") ?? formatDateParam(startOfDay(new Date()));

  const [meal, setMeal] = useState<MealLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [saving, setSaving] = useState(false);
  const [mealType, setMealType] = useState<MealType | null>(null);
  const [items, setItems] = useState<EditableMealItem[]>([]);

  const mealsListHref = useMemo(() => {
    const today = formatDateParam(new Date());
    return dateParam === today ? "/meals" : `/meals?date=${dateParam}`;
  }, [dateParam]);

  const loadMeal = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const parsedDate = parseDateParam(dateParam);
      if (!parsedDate) {
        setError("Data inválida na URL.");
        setMeal(null);
        return;
      }

      const data = await getMealLogByDateAndId(dateParam, mealId);
      if (!data) {
        setError("Refeição não encontrada para esta data.");
        setMeal(null);
        return;
      }

      setMeal(data);
      setMealType(data.mealType);
      setItems(mealLogToEditableItems(data));
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Não foi possível carregar a refeição.";
      setError(message);
      setMeal(null);
    } finally {
      setLoading(false);
    }
  }, [dateParam, mealId]);

  useEffect(() => {
    void loadMeal();
  }, [loadMeal]);

  function startEditing() {
    if (!meal) return;
    setMealType(meal.mealType);
    setItems(mealLogToEditableItems(meal));
    setMode("edit");
  }

  function cancelEditing() {
    if (!meal) return;
    setMealType(meal.mealType);
    setItems(mealLogToEditableItems(meal));
    setMode("view");
  }

  function updateItem(index: number, item: EditableMealItem) {
    setItems((current) => current.map((row, i) => (i === index ? item : row)));
  }

  function removeItem(index: number) {
    setItems((current) => current.filter((_, i) => i !== index));
  }

  async function handleSave() {
    if (!meal || saving || !mealType) return;

    if (!items.length) {
      toast.error("A refeição precisa ter ao menos um item.");
      return;
    }

    if (items.some((item) => !item.name.trim())) {
      toast.error("Preencha o nome de todos os itens.");
      return;
    }

    if (items.some((item) => item.estimatedQuantityGrams <= 0)) {
      toast.error("Informe uma quantidade válida em gramas para cada item.");
      return;
    }

    if (items.some((item) => !item.id.trim())) {
      toast.error("Item sem identificador. Recarregue a página e tente novamente.");
      return;
    }

    setSaving(true);
    try {
      const updated = await updateMealLog(meal.id, {
        mealType,
        name: meal.name,
        items: items.map((item) => ({
          id: item.id,
          name: item.name.trim(),
          estimatedQuantityGrams: item.estimatedQuantityGrams,
        })),
      });

      setMeal(updated);
      setMealType(updated.mealType);
      setItems(mealLogToEditableItems(updated));
      setMode("view");
      toast.success("Refeição atualizada com sucesso.");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Não foi possível salvar as alterações.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <PageScaffold
        title="Carregando refeição..."
        breadcrumbs={[
          { label: "Início", href: "/" },
          { label: "Refeições", href: mealsListHref },
          { label: "Detalhe" },
        ]}
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </PageScaffold>
    );
  }

  if (error || !meal) {
    return (
      <PageScaffold
        title="Refeição"
        breadcrumbs={[
          { label: "Início", href: "/" },
          { label: "Refeições", href: mealsListHref },
          { label: "Detalhe" },
        ]}
      >
        <Alert variant="destructive" title="Não foi possível abrir a refeição">
          {error ?? "Refeição não encontrada."}
        </Alert>
        <ActionBar variant="inline">
          <Link href={mealsListHref} className={buttonVariants({ variant: "outline", size: "lg" })}>
            Voltar para refeições
          </Link>
        </ActionBar>
      </PageScaffold>
    );
  }

  const mealLabel = meal.name || getMealTypeLabel(meal.mealType);
  const macroTotals = mealLogToMacroTotals(meal);
  const canEditItems = meal.items.length > 0;

  return (
    <PageScaffold
      title={mode === "edit" ? "Editar refeição" : "Visualizar refeição"}
      subtitle={
        mode === "edit"
          ? "Ajuste o tipo, nomes e quantidades dos alimentos."
          : formatMealDateTime(meal.consumedAt)
      }
      breadcrumbs={[
        { label: "Início", href: "/" },
        { label: "Refeições", href: mealsListHref },
        { label: mealLabel },
      ]}
      action={
        mode === "view" ? (
          <ActionBar variant="header">
            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={!canEditItems}
              onClick={startEditing}
            >
              <PencilLine className="size-4" />
              Editar refeição
            </Button>
          </ActionBar>
        ) : (
          <ActionBar variant="header">
            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={saving}
              onClick={cancelEditing}
            >
              Cancelar
            </Button>
          </ActionBar>
        )
      }
    >
      {mode === "view" ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <Card className="overflow-hidden shadow-xs">
            <div className="grid sm:grid-cols-[140px_1fr]">
              <MealTypeImage
                mealType={meal.mealType}
                alt={mealLabel}
                className="h-36 w-full border-b border-border object-cover sm:h-full sm:min-h-[160px] sm:border-b-0 sm:border-r"
                sizes="160px"
              />
              <CardContent className="flex flex-col justify-center gap-3 py-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-primary">
                    {getMealTypeLabel(meal.mealType)}
                  </p>
                  <h2 className="mt-1 text-xl font-semibold">{mealLabel}</h2>
                </div>
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-muted-foreground">
                    <Clock className="size-3.5" aria-hidden />
                    {formatMealTime(meal.consumedAt)}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
                    {Math.round(meal.totalCalories)} kcal
                  </span>
                </div>
                {meal.notes ? (
                  <p className="text-sm text-muted-foreground">{meal.notes}</p>
                ) : null}
              </CardContent>
            </div>
          </Card>

          <Card className="shadow-xs">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="text-section-title">
                Macronutrientes
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <MealMacroDonutChart totals={macroTotals} />
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {!canEditItems ? (
            <Alert variant="warning" title="Edição limitada">
              Esta refeição não possui itens detalhados para editar.
            </Alert>
          ) : null}

          <Card className="shadow-xs">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="text-section-title">
                Tipo de refeição
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <MealTypePicker
                value={mealType}
                onChange={setMealType}
              />
            </CardContent>
          </Card>
        </div>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="size-4 text-muted-foreground" aria-hidden />
            <h2 className="text-section-title">Alimentos</h2>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {mode === "edit" ? items.length : meal.items.length}
            </span>
          </div>
        </div>

        {mode === "view" ? (
          meal.items.length === 0 ? (
            <div className="surface-card px-4 py-8 text-center text-sm text-muted-foreground">
              Nenhum alimento listado para esta refeição.
            </div>
          ) : (
            <div className="grid gap-3 lg:grid-cols-2">
              {meal.items.map((item, index) => (
                <MealLogItemCard key={item.id} item={item} index={index + 1} />
              ))}
            </div>
          )
        ) : items.length === 0 ? (
          <div className="surface-card px-4 py-8 text-center text-sm text-muted-foreground">
            Adicione ao menos um item para salvar a refeição.
          </div>
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {items.map((item, index) => (
              <MealLogItemEditor
                key={item.id}
                item={item}
                index={index}
                onChange={updateItem}
                onRemove={removeItem}
                canRemove={items.length > 1}
              />
            ))}
          </div>
        )}
      </section>

      {mode === "edit" ? (
        <ActionBar variant="footer">
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={saving}
            onClick={cancelEditing}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            size="lg"
            className="shadow-sm"
            disabled={saving || !canEditItems}
            onClick={handleSave}
          >
            {saving ? "Salvando..." : "Salvar alterações"}
          </Button>
        </ActionBar>
      ) : null}

      {!canEditItems && mode === "view" ? (
        <Alert variant="info" title="Edição indisponível">
          Esta refeição foi registrada sem itens individuais. Não é possível
          editá-la pelo app web no momento.
        </Alert>
      ) : null}
    </PageScaffold>
  );
}
