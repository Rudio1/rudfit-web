"use client";

import { Flame, Leaf } from "lucide-react";
import type { DailyGoalsResponse } from "@/lib/types/onboarding";
import { formatMacroValue } from "@/lib/meals/progress";
import { ActionBar } from "@/components/ui/action-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";

interface OnboardingGoalsResultProps {
  mode: "firstAccess" | "recalculate";
  goals: DailyGoalsResponse;
  loading?: boolean;
  onContinue: () => void;
}

export function OnboardingGoalsResult({
  mode,
  goals,
  loading = false,
  onContinue,
}: OnboardingGoalsResultProps) {
  const isRecalculate = mode === "recalculate";

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 py-8 lg:max-w-3xl">
      <header className="mb-8 space-y-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {isRecalculate ? (
            <Flame className="size-7" aria-hidden />
          ) : (
            <Leaf className="size-7" aria-hidden />
          )}
        </div>
        <div>
          <p className="text-caption font-medium uppercase tracking-wider text-primary">
            {isRecalculate ? "Plano atualizado" : "Tudo pronto"}
          </p>
          <h1 className="text-page-title">
            {isRecalculate ? "Metas atualizadas" : "Suas metas diárias"}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {isRecalculate
              ? "Suas calorias e macros diários foram recalculados com base no perfil revisado."
              : "Calculamos um plano inicial com base no seu perfil. Você pode ajustá-lo depois quando quiser."}
          </p>
        </div>
      </header>

      <div className="flex-1 space-y-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <StatCard
            label="Calorias"
            value={`${Math.round(goals.dailyCaloriesGoal)} kcal`}
            icon={Flame}
            trend="success"
          />
          <StatCard
            label="Proteína"
            value={`${formatMacroValue(goals.dailyProteinGoal)} g`}
          />
          <StatCard
            label="Carboidratos"
            value={`${formatMacroValue(goals.dailyCarbsGoal)} g`}
          />
          <StatCard
            label="Gorduras"
            value={`${formatMacroValue(goals.dailyFatGoal)} g`}
          />
        </div>

        <Card className="border-primary/20 shadow-xs">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-section-title">
              {isRecalculate ? "Próximos passos" : "Resumo do plano"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {isRecalculate
                ? "As novas metas já estão salvas no seu perfil. Acompanhe o progresso na home e ajuste novamente quando quiser."
                : "Essas metas são um ponto de partida. Acompanhe seu progresso no dashboard e recalcule pelo perfil conforme evoluir."}
            </p>
          </CardContent>
        </Card>
      </div>

      <ActionBar variant="footer" className="mt-8 pb-[env(safe-area-inset-bottom)]">
        <Button
          size="lg"
          className="shadow-sm"
          disabled={loading}
          onClick={onContinue}
        >
          {loading
            ? "Carregando..."
            : isRecalculate
              ? "Voltar ao perfil"
              : "Começar"}
        </Button>
      </ActionBar>
    </div>
  );
}
