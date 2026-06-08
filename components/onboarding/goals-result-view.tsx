"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { calculateDailyGoals } from "@/lib/api/onboarding";
import { ApiError } from "@/lib/api/errors";
import { markFirstAccessComplete } from "@/lib/auth/session";
import { getPendingInviteRedirect } from "@/lib/friendships/pending-invite";
import type { DailyGoalsResponse } from "@/lib/types/onboarding";
import { OnboardingGoalsResult } from "@/components/onboarding/onboarding-goals-result";
import { OnboardingSidePanel } from "@/components/onboarding/onboarding-side-panel";
import { Alert } from "@/components/ui/alert";
import { ActionBar } from "@/components/ui/action-bar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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

    void loadGoals();
  }, []);

  function handleStart() {
    markFirstAccessComplete();
    const pendingInvite = getPendingInviteRedirect();
    router.push(pendingInvite ?? "/");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="grid min-h-dvh lg:grid-cols-2">
        <OnboardingSidePanel mode="firstAccess" step={6} />
        <div className="mx-auto w-full max-w-2xl space-y-6 px-4 py-8 lg:max-w-3xl">
          <Skeleton className="h-14 w-14 rounded-2xl" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-24 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
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
    <div className="grid min-h-dvh lg:grid-cols-2">
      <OnboardingSidePanel mode="firstAccess" step={6} />
      <OnboardingGoalsResult
        mode="firstAccess"
        goals={goals}
        onContinue={handleStart}
      />
    </div>
  );
}
