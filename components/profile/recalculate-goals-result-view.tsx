"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  parseRecalculateGoalsPayload,
  type RecalculateGoalsPayload,
} from "@/lib/goals/daily-goals";
import { useProfile } from "@/lib/hooks/use-profile";
import { DailyGoalsOverview } from "@/components/goals/daily-goals-overview";
import { PageScaffold } from "@/components/layout/page-scaffold";
import { Alert } from "@/components/ui/alert";
import { ActionBar } from "@/components/ui/action-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const STORAGE_KEY = "rudfit_recalculate_goals";

export function RecalculateGoalsResultView() {
  const router = useRouter();
  const { refresh } = useProfile();
  const [payload, setPayload] = useState<RecalculateGoalsPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [finishing, setFinishing] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setError("Nenhum resultado de recálculo encontrado.");
      setLoading(false);
      return;
    }

    const parsed = parseRecalculateGoalsPayload(raw);
    if (!parsed) {
      setError("Não foi possível carregar as metas recalculadas.");
    } else {
      setPayload(parsed);
    }
    setLoading(false);
  }, []);

  async function handleFinish() {
    setFinishing(true);
    sessionStorage.removeItem(STORAGE_KEY);
    await refresh();
    router.push("/profile");
    router.refresh();
  }

  if (loading) {
    return (
      <PageScaffold
        title="Metas atualizadas"
        subtitle="Carregando seu novo plano..."
        breadcrumbs={[
          { label: "Perfil", href: "/profile" },
          { label: "Recalcular", href: "/profile/recalculate" },
          { label: "Resultado" },
        ]}
      >
        <div className="grid gap-6 xl:grid-cols-2">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
        <Skeleton className="h-48 rounded-xl" />
      </PageScaffold>
    );
  }

  if (error || !payload) {
    return (
      <PageScaffold
        title="Metas atualizadas"
        subtitle="Não foi possível exibir o resultado"
        breadcrumbs={[
          { label: "Perfil", href: "/profile" },
          { label: "Resultado" },
        ]}
      >
        <Alert variant="destructive" title="Erro ao carregar metas">
          {error ?? "Erro ao carregar metas."}
        </Alert>
        <ActionBar variant="single" className="mt-4">
          <Button
            size="lg"
            className="shadow-sm"
            onClick={() => router.push("/profile/recalculate")}
          >
            Tentar novamente
          </Button>
        </ActionBar>
      </PageScaffold>
    );
  }

  return (
    <PageScaffold
      title="Metas atualizadas"
      subtitle="Seu plano diário foi recalculado com base no perfil revisado"
      breadcrumbs={[
        { label: "Perfil", href: "/profile" },
        { label: "Recalcular", href: "/profile/recalculate" },
        { label: "Resultado" },
      ]}
    >
      <DailyGoalsOverview
        goals={payload.current}
        previousGoals={payload.previous}
      />

      <Card className="border-primary/20 shadow-xs">
        <CardContent className="py-5">
          <p className="text-sm leading-relaxed text-muted-foreground">
            As novas metas já estão salvas no seu perfil. Acompanhe o progresso
            na home e ajuste novamente pelo perfil quando quiser.
          </p>
          <ActionBar variant="footer" className="mt-4 border-t-0 pt-0">
            <Button
              size="lg"
              className="shadow-sm"
              disabled={finishing}
              onClick={handleFinish}
            >
              {finishing ? "Salvando..." : "Voltar ao perfil"}
            </Button>
          </ActionBar>
        </CardContent>
      </Card>
    </PageScaffold>
  );
}
