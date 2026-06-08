"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Camera, Plus, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { listMealLogsByDate } from "@/lib/api/meal-logs";
import { ApiError } from "@/lib/api/errors";
import { getMealTypeLabel } from "@/lib/meals/constants";
import {
  formatDateLabel,
  formatDateParam,
  getDateContextLabel,
  isFutureDate,
  isToday,
  parseDateParam,
  startOfDay,
} from "@/lib/meals/dates";
import type { MealLog } from "@/lib/types/meals";
import { MealTypeImage } from "@/components/meals/meal-type-image";
import { MealsDatePicker } from "@/components/meals/meals-date-picker";
import { PageScaffold } from "@/components/layout/page-scaffold";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { MealListSkeleton } from "@/components/ui/content-skeletons";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

function getInitialDate(searchParams: URLSearchParams): Date {
  const param = searchParams.get("date");
  if (param) {
    const parsed = parseDateParam(param);
    if (parsed && !isFutureDate(parsed)) return parsed;
  }
  return startOfDay(new Date());
}

export function MealsDayView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedDate, setSelectedDate] = useState(() =>
    getInitialDate(searchParams),
  );
  const [logs, setLogs] = useState<MealLog[]>([]);
  const [loading, setLoading] = useState(true);

  const dateParam = formatDateParam(selectedDate);

  const syncDateInUrl = useCallback(
    (date: Date) => {
      const nextParam = formatDateParam(date);
      const params = new URLSearchParams(searchParams.toString());

      if (isToday(date)) {
        params.delete("date");
      } else {
        params.set("date", nextParam);
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  const handleSelectDate = useCallback(
    (date: Date) => {
      const normalized = startOfDay(date);
      setSelectedDate(normalized);
      syncDateInUrl(normalized);
    },
    [syncDateInUrl],
  );

  useEffect(() => {
    const param = searchParams.get("date");

    if (!param) {
      setSelectedDate(startOfDay(new Date()));
      return;
    }

    const parsed = parseDateParam(param);
    if (parsed && !isFutureDate(parsed)) {
      setSelectedDate(parsed);
    }
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;

    async function loadMeals() {
      setLoading(true);
      try {
        const data = await listMealLogsByDate(dateParam);
        if (!cancelled) setLogs(data);
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof ApiError
              ? error.message
              : "Não foi possível carregar as refeições.";
          toast.error(message);
          setLogs([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadMeals();

    return () => {
      cancelled = true;
    };
  }, [dateParam]);

  const totalCalories = useMemo(
    () => logs.reduce((sum, log) => sum + log.totalCalories, 0),
    [logs],
  );

  const subtitle = loading
    ? "Carregando suas refeições..."
    : `${logs.length} ${logs.length === 1 ? "registro" : "registros"} em ${getDateContextLabel(selectedDate)} · ${Math.round(totalCalories)} kcal`;

  const emptyDescription = isToday(selectedDate)
    ? "Você ainda não registrou refeições hoje. Use a câmera com IA para adicionar a primeira."
    : `Nenhuma refeição registrada em ${formatDateLabel(selectedDate).toLowerCase()}.`;

  function mealDetailHref(mealLogId: string) {
    return `/meals/${mealLogId}?date=${dateParam}`;
  }

  return (
    <PageScaffold
      title="Refeições"
      subtitle={subtitle}
      breadcrumbs={[{ label: "Início", href: "/" }, { label: "Refeições" }]}
      action={
        <Link
          href="/meals/add"
          className={cn(buttonVariants({ size: "lg" }), "shadow-sm")}
        >
          <Plus className="size-4" />
          Adicionar
        </Link>
      }
    >
      <MealsDatePicker
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
      />

      {loading ? (
        <MealListSkeleton />
      ) : logs.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title="Nada por aqui"
          description={emptyDescription}
          action={
            isToday(selectedDate) ? (
              <Link
                href="/meals/add"
                className={cn(buttonVariants({ size: "lg" }), "shadow-sm")}
              >
                <Camera className="size-4" />
                Adicionar refeição com IA
              </Link>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => handleSelectDate(new Date())}
              >
                Ver refeições de hoje
              </Button>
            )
          }
        />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-xl border border-border bg-card shadow-xs md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left">
                  <th className="px-4 py-3 font-medium text-muted-foreground">
                    Refeição
                  </th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">
                    Macros
                  </th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">
                    Calorias
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    Horário
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="action-link cursor-pointer border-b border-border/60 transition-colors last:border-0 hover:bg-muted/30"
                    onClick={() => router.push(mealDetailHref(log.id))}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        router.push(mealDetailHref(log.id));
                      }
                    }}
                    tabIndex={0}
                    role="link"
                    aria-label={`Ver refeição ${log.name || getMealTypeLabel(log.mealType)}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <MealTypeImage
                          mealType={log.mealType}
                          alt={log.name || getMealTypeLabel(log.mealType)}
                          className="size-10 shrink-0 rounded-lg"
                          sizes="40px"
                        />
                        <div className="min-w-0">
                          <p className="font-medium">
                            {log.name || getMealTypeLabel(log.mealType)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {getMealTypeLabel(log.mealType)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">
                      P {formatMacro(log.totalProtein)} · C{" "}
                      {formatMacro(log.totalCarbs)} · G{" "}
                      {formatMacro(log.totalFat)}
                    </td>
                    <td className="px-4 py-3 font-medium tabular-nums">
                      {log.totalCalories} kcal
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                      {formatTime(log.consumedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {logs.map((log) => (
              <Link
                key={log.id}
                href={mealDetailHref(log.id)}
                className="action-link surface-card flex items-center gap-4 p-3 transition-colors hover:bg-muted/30"
              >
                <MealTypeImage
                  mealType={log.mealType}
                  alt={log.name || getMealTypeLabel(log.mealType)}
                  className="size-14 shrink-0 rounded-lg"
                  sizes="56px"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">
                    {log.name || getMealTypeLabel(log.mealType)}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {log.totalCalories} kcal · P{" "}
                    {formatMacro(log.totalProtein)} · C{" "}
                    {formatMacro(log.totalCarbs)} · G{" "}
                    {formatMacro(log.totalFat)}
                  </p>
                </div>
                <div className="shrink-0 text-right text-xs text-muted-foreground">
                  {formatTime(log.consumedAt)}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </PageScaffold>
  );
}

function formatMacro(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function formatTime(value: string): string {
  const date = new Date(value);
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
