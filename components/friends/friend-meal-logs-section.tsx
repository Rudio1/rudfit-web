"use client";

import { useState } from "react";
import { ChevronDown, UtensilsCrossed } from "lucide-react";
import { getMealTypeLabel } from "@/lib/meals/constants";
import type { MealLog } from "@/lib/types/meals";
import { MealLogItemCard } from "@/components/meals/meal-log-item-card";
import { MealTypeImage } from "@/components/meals/meal-type-image";
import { MealListSkeleton } from "@/components/ui/content-skeletons";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FriendMealLogsSectionProps {
  friendName: string;
  logs: MealLog[];
  loading: boolean;
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

export function FriendMealLogsSection({
  friendName,
  logs,
  loading,
}: FriendMealLogsSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <Card className="shadow-xs">
      <CardHeader className="border-b border-border pb-4">
        <CardTitle className="flex items-center gap-2 text-section-title">
          <UtensilsCrossed className="size-5 text-primary" aria-hidden />
          Refeições de {friendName}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {loading ? (
          <MealListSkeleton count={2} />
        ) : logs.length === 0 ? (
          <EmptyState
            icon={UtensilsCrossed}
            title="Nenhuma refeição"
            description={`${friendName} ainda não registrou refeições neste dia.`}
            className="border-none bg-transparent py-8 shadow-none"
          />
        ) : (
          <div className="space-y-3">
            {logs.map((log) => {
              const isExpanded = expandedId === log.id;
              const title = log.name || getMealTypeLabel(log.mealType);

              return (
                <div key={log.id} className="overflow-hidden rounded-xl border border-border">
                  <button
                    type="button"
                    className="action-link flex w-full items-center gap-4 bg-card p-3 text-left transition-colors hover:bg-muted/30"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : log.id)
                    }
                    aria-expanded={isExpanded}
                  >
                    <MealTypeImage
                      mealType={log.mealType}
                      alt={title}
                      className="size-14 shrink-0 rounded-lg"
                      sizes="56px"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {log.totalCalories} kcal · P{" "}
                        {formatMacro(log.totalProtein)} · C{" "}
                        {formatMacro(log.totalCarbs)} · G{" "}
                        {formatMacro(log.totalFat)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                      <span className="tabular-nums">{formatTime(log.consumedAt)}</span>
                      <ChevronDown
                        className={cn(
                          "size-4 transition-transform",
                          isExpanded && "rotate-180",
                        )}
                        aria-hidden
                      />
                    </div>
                  </button>

                  {isExpanded ? (
                    <div className="space-y-3 border-t border-border bg-muted/20 p-3">
                      {log.items.map((item, index) => (
                        <MealLogItemCard
                          key={item.id}
                          item={item}
                          index={index + 1}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
