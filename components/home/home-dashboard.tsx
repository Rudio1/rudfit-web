"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Camera,
  UtensilsCrossed,
} from "lucide-react";
import { toast } from "sonner";
import { getDailyGoals } from "@/lib/api/onboarding";
import { getDailySummary } from "@/lib/api/meal-logs";
import { ApiError } from "@/lib/api/errors";
import { useProfile } from "@/lib/hooks/use-profile";
import { formatDateParam } from "@/lib/meals/constants";
import { macroPercent, macroRemaining } from "@/lib/meals/progress";
import type { DailyGoalsResponse } from "@/lib/types/onboarding";
import type { DailyConsumptionSummary } from "@/lib/types/meals";
import { CalorieRingChart } from "@/components/home/calorie-ring-chart";
import { HomeDashboardSkeleton } from "@/components/home/home-dashboard-skeleton";
import { MacroProgressSection } from "@/components/home/macro-progress-section";
import { PageScaffold } from "@/components/layout/page-scaffold";
import { Alert } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ActionBar } from "@/components/ui/action-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

function formatTodayLabel(date: Date): string {
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function HomeDashboard() {
  const { displayName } = useProfile();
  const [summary, setSummary] = useState<DailyConsumptionSummary | null>(null);
  const [goals, setGoals] = useState<DailyGoalsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const today = formatDateParam(new Date());

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [summaryData, goalsData] = await Promise.all([
          getDailySummary(today),
          getDailyGoals(),
        ]);
        setSummary(summaryData);
        setGoals(goalsData);
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : "Não foi possível carregar seu resumo de hoje.";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }

    void loadDashboard();
  }, [today]);

  if (loading) {
    return <HomeDashboardSkeleton />;
  }

  if (!summary || !goals) {
    return (
      <PageScaffold title="Início" subtitle="Resumo nutricional de hoje">
        <Alert variant="destructive" title="Não conseguimos carregar seu resumo">
          Verifique sua conexão e tente recarregar a página.
        </Alert>
      </PageScaffold>
    );
  }

  const caloriePercent = macroPercent(
    summary.totalCalories,
    goals.dailyCaloriesGoal,
  );
  const caloriesRemaining = macroRemaining(
    summary.totalCalories,
    goals.dailyCaloriesGoal,
  );
  const goalReached = summary.totalCalories >= goals.dailyCaloriesGoal;

  return (
    <PageScaffold
      title={`Olá, ${displayName}`}
      subtitle={formatTodayLabel(new Date())}
      action={
        <Link
          href="/meals/add"
          className={cn(buttonVariants({ size: "lg" }), "shadow-sm")}
        >
          <Camera className="size-4" />
          Adicionar refeição
        </Link>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <Card className="shadow-xs">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-section-title">
              Calorias de hoje
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <CalorieRingChart
              consumed={summary.totalCalories}
              goal={goals.dailyCaloriesGoal}
              percent={caloriePercent}
            />
            <p className="mt-4 text-center text-sm text-muted-foreground">
              {goalReached
                ? "Meta calórica atingida. Parabéns!"
                : `Faltam ${Math.round(caloriesRemaining)} kcal para a meta diária.`}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-section-title">
              Macronutrientes
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <MacroProgressSection
              protein={{
                consumed: summary.totalProtein,
                goal: goals.dailyProteinGoal,
              }}
              carbs={{
                consumed: summary.totalCarbs,
                goal: goals.dailyCarbsGoal,
              }}
              fat={{
                consumed: summary.totalFat,
                goal: goals.dailyFatGoal,
              }}
            />
          </CardContent>
        </Card>
      </div>

      {summary.mealsCount === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title="Nenhuma refeição registrada hoje"
          description="Use a câmera com IA para registrar sua primeira refeição e acompanhar suas metas."
          action={
            <Link
              href="/meals/add"
              className={cn(buttonVariants({ size: "lg" }), "shadow-sm")}
            >
              <Camera className="size-4" />
              Adicionar refeição
            </Link>
          }
        />
      ) : (
        <Card className="shadow-xs">
          <CardContent className="flex flex-col gap-4 py-5">
            <div>
              <p className="font-medium">
                {summary.mealsCount}{" "}
                {summary.mealsCount === 1 ? "refeição" : "refeições"} registradas
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Veja o detalhe de cada registro na aba Refeições
              </p>
            </div>
            <ActionBar variant="inline">
              <Link
                href="/meals"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                Ver refeições
              </Link>
            </ActionBar>
          </CardContent>
        </Card>
      )}
    </PageScaffold>
  );
}
