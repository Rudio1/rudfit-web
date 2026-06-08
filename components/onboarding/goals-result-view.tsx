"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { calculateDailyGoals } from "@/lib/api/onboarding";
import { ApiError } from "@/lib/api/errors";
import { markFirstAccessComplete } from "@/lib/auth/session";
import type { DailyGoalsResponse } from "@/lib/types/onboarding";
import { Alert } from "@/components/ui/alert";
import { ActionBar } from "@/components/ui/action-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/ui/stat-card";

export function GoalsResultView() {
  const router = useRouter();
  const [goals, setGoals] = useState<DailyGoalsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGoals() {
      try {
        const response = await calculateDailyGoals();
        setGoals(response);
      } catch (err) {
        setError(
          err instanceof ApiError
            ? err.message
            : "Não foi possível calcular suas metas.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadGoals();
  }, []);

  function handleStart() {
    markFirstAccessComplete();
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-6 px-4 py-8 lg:max-w-3xl">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    );
  }

  if (error || !goals) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-8 lg:max-w-3xl">
        <Alert variant="destructive" title="Erro ao carregar metas">
          {error ?? "Erro ao carregar metas."}
        </Alert>
        <ActionBar variant="single" className="mt-4">
          <Button
            size="lg"
            className="shadow-sm"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </Button>
        </ActionBar>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 py-8 lg:max-w-3xl">
      <div className="flex-1 space-y-6">
        <div>
          <h1 className="text-page-title">Suas metas diárias</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Calculamos um plano inicial com base no seu perfil.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <StatCard
            label="Calorias"
            value={`${goals.dailyCaloriesGoal} kcal`}
          />
          <StatCard
            label="Proteína"
            value={`${goals.dailyProteinGoal} g`}
          />
          <StatCard
            label="Carboidratos"
            value={`${goals.dailyCarbsGoal} g`}
          />
          <StatCard label="Gorduras" value={`${goals.dailyFatGoal} g`} />
        </div>

        <Card className="border-primary/20 shadow-xs">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-section-title">Resumo do plano</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Essas metas são um ponto de partida. Você pode ajustá-las
              conforme evolui e acompanhar seu progresso no dashboard principal.
            </p>
          </CardContent>
        </Card>
      </div>

      <ActionBar variant="footer" className="mt-8">
        <Button size="lg" className="shadow-sm" onClick={handleStart}>
          Começar
        </Button>
      </ActionBar>
    </div>
  );
}
