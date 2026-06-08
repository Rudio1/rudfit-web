"use client";

import Link from "next/link";
import { ArrowLeft, Leaf } from "lucide-react";
import { ONBOARDING_STEPS } from "@/lib/onboarding/steps";
import { OnboardingStepIndicator } from "@/components/onboarding/onboarding-step-indicator";
import { ActionBar } from "@/components/ui/action-bar";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type OnboardingShellMode = "firstAccess" | "recalculate";

interface OnboardingShellProps {
  mode: OnboardingShellMode;
  step: number;
  progress: number;
  backHref?: string;
  backLabel?: string;
  loading?: boolean;
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
  canGoBack: boolean;
  error?: string | null;
  children: React.ReactNode;
}

export function OnboardingShell({
  mode,
  step,
  progress,
  backHref,
  backLabel = "Voltar",
  loading = false,
  onBack,
  onNext,
  nextLabel,
  canGoBack,
  error,
  children,
}: OnboardingShellProps) {
  const isRecalculate = mode === "recalculate";
  const stepMeta = ONBOARDING_STEPS[step];
  const StepIcon = stepMeta.icon;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col lg:max-w-none">
      {backHref ? (
        <div className="mb-4">
          <Link
            href={backHref}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "-ml-2 inline-flex",
            )}
          >
            <ArrowLeft className="size-4" />
            {backLabel}
          </Link>
        </div>
      ) : null}

      <header className="mb-6 space-y-5">
        {!isRecalculate ? (
          <div className="flex items-center gap-3 lg:hidden">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Leaf className="size-4" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold">Configurar perfil</p>
              <p className="text-caption">Primeiro acesso</p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-caption font-medium uppercase tracking-wider text-primary">
              Perfil
            </p>
            <h1 className="text-page-title">Recalcular metas</h1>
            <p className="text-sm text-muted-foreground">
              Revise objetivo, medidas e hábitos. Ao concluir, calorias e macros
              serão recalculados no servidor.
            </p>
          </div>
        )}

        <OnboardingStepIndicator currentStep={step} />

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{Math.round(progress)}% concluído</span>
          <span className="tabular-nums">
            Passo {step + 1} de {ONBOARDING_STEPS.length}
          </span>
        </div>
      </header>

      <div className="surface-card flex min-h-0 flex-1 flex-col overflow-hidden">
        <div
          key={step}
          className="flex flex-1 flex-col p-5 animate-in fade-in-0 slide-in-from-right-2 duration-300 sm:p-6 lg:p-8"
        >
          <div className="mb-6 flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <StepIcon className="size-5" aria-hidden />
            </span>
            <div className="min-w-0 space-y-1">
              <h2 className="text-section-title text-lg sm:text-xl">
                {stepMeta.title}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {stepMeta.subtitle}
              </p>
            </div>
          </div>

          <div className="flex-1">{children}</div>

          {error ? (
            <p
              role="alert"
              className="mt-4 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          ) : null}
        </div>

        <ActionBar
          variant="footer"
          className="sticky bottom-0 border-t border-border bg-card/95 px-5 py-4 backdrop-blur-sm sm:px-6 lg:px-8 pb-[max(1rem,env(safe-area-inset-bottom))]"
        >
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={!canGoBack || loading}
            onClick={onBack}
          >
            Voltar
          </Button>
          <Button
            type="button"
            size="lg"
            className="shadow-sm"
            disabled={loading}
            onClick={onNext}
          >
            {loading ? "Salvando..." : nextLabel}
          </Button>
        </ActionBar>
      </div>
    </div>
  );
}
