"use client";

import { useProfile } from "@/lib/hooks/use-profile";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileRecalculatePage() {
  const { profile, loading, refresh } = useProfile();

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-6 px-4 py-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full max-w-md" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-8">
        <Alert variant="destructive" title="Perfil indisponível">
          Não foi possível carregar seu perfil para recalcular as metas.
        </Alert>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => void refresh()}
        >
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <OnboardingWizard
      mode="recalculate"
      initialProfile={profile}
      backHref="/profile"
      backLabel="Voltar ao perfil"
    />
  );
}
