"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Scale } from "lucide-react";
import { toast } from "sonner";
import { completeOnboarding } from "@/lib/api/onboarding";
import { recalculateDailyGoals } from "@/lib/api/profile";
import { ApiError } from "@/lib/api/errors";
import {
  ACTIVITY_OPTIONS,
  GENDER_OPTIONS,
  GOAL_OPTIONS,
  INTENSITY_OPTIONS,
  ONBOARDING_STEP_COUNT,
  ROUTINE_OPTIONS,
} from "@/lib/onboarding/steps";
import {
  formStateToOnboardingRequest,
  profileToOnboardingFormState,
} from "@/lib/profile/map-profile-to-request";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { OnboardingSidePanel } from "@/components/onboarding/onboarding-side-panel";
import {
  MetricField,
  OptionCard,
  SelectionTile,
} from "@/components/onboarding/option-card";
import {
  ActivityLevelType,
  INITIAL_ONBOARDING_STATE,
  type OnboardingFormState,
} from "@/lib/types/onboarding";
import type { UserProfile } from "@/lib/types/profile";
import { cn } from "@/lib/utils";

type OnboardingWizardMode = "firstAccess" | "recalculate";

interface OnboardingWizardProps {
  mode?: OnboardingWizardMode;
  initialProfile?: UserProfile;
  backHref?: string;
  backLabel?: string;
}

export function OnboardingWizard({
  mode = "firstAccess",
  initialProfile,
  backHref,
  backLabel,
}: OnboardingWizardProps) {
  const router = useRouter();
  const isRecalculate = mode === "recalculate";
  const showSidePanel = !isRecalculate;
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<OnboardingFormState>(() =>
    initialProfile
      ? { ...INITIAL_ONBOARDING_STATE, ...profileToOnboardingFormState(initialProfile) }
      : INITIAL_ONBOARDING_STATE,
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const progress = useMemo(
    () => ((step + 1) / ONBOARDING_STEP_COUNT) * 100,
    [step],
  );

  const nextLabel =
    loading
      ? "Salvando..."
      : step === ONBOARDING_STEP_COUNT - 1
        ? isRecalculate
          ? "Recalcular metas"
          : "Finalizar cadastro"
        : "Continuar";

  function updateForm(partial: Partial<OnboardingFormState>) {
    setForm((current) => ({ ...current, ...partial }));
    setError(null);
  }

  function validateStep(): string | null {
    switch (step) {
      case 0:
        return form.goal ? null : "Selecione um objetivo para continuar.";
      case 1:
        return form.gender ? null : "Selecione uma opção para continuar.";
      case 2: {
        const age = Number(form.age);
        const height = Number(form.height.replace(",", "."));
        const weight = Number(form.weight.replace(",", "."));
        if (!age || age < 10 || age > 120) return "Informe uma idade válida.";
        if (!height || height < 1 || height > 2.5)
          return "Informe a altura em metros (ex.: 1,75).";
        if (!weight || weight < 20 || weight > 400)
          return "Informe um peso válido em kg.";
        return null;
      }
      case 3: {
        const target = Number(form.targetWeight.replace(",", "."));
        if (!target || target < 20 || target > 400)
          return "Informe um peso meta válido.";
        return null;
      }
      case 4:
        return form.dailyRoutineLevel
          ? null
          : "Selecione sua rotina diária.";
      case 5:
        return form.activityLevel
          ? null
          : "Selecione seu nível de atividade.";
      case 6:
        return form.goalIntensity ? null : "Selecione o ritmo desejado.";
      default:
        return null;
    }
  }

  async function handleNext() {
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (step < ONBOARDING_STEP_COUNT - 1) {
      setStep((current) => current + 1);
      return;
    }

    await submitOnboarding();
  }

  async function submitOnboarding() {
    if (loading) return;

    if (
      !form.goal ||
      !form.gender ||
      !form.activityLevel ||
      !form.dailyRoutineLevel ||
      !form.goalIntensity
    ) {
      setError("Preencha todas as etapas antes de continuar.");
      return;
    }

    const startingWeight = isRecalculate
      ? (initialProfile?.startingWeight ??
        Math.round(Number(form.weight.replace(",", "."))))
      : Math.round(Number(form.weight.replace(",", ".")));

    const request = formStateToOnboardingRequest(
      {
        goal: form.goal,
        gender: form.gender,
        age: form.age,
        height: form.height,
        weight: form.weight,
        targetWeight: form.targetWeight,
        activityLevel: form.activityLevel,
        dailyRoutineLevel: form.dailyRoutineLevel,
        goalIntensity: form.goalIntensity,
      },
      startingWeight,
    );

    setLoading(true);
    try {
      if (isRecalculate) {
        const goals = await recalculateDailyGoals(request);
        sessionStorage.setItem(
          "rudfit_recalculate_goals",
          JSON.stringify({
            current: goals,
            previous: initialProfile
              ? {
                  dailyCaloriesGoal: initialProfile.dailyCaloriesGoal,
                  dailyProteinGoal: initialProfile.dailyProteinGoal,
                  dailyCarbsGoal: initialProfile.dailyCarbsGoal,
                  dailyFatGoal: initialProfile.dailyFatGoal,
                }
              : null,
          }),
        );
        router.push("/profile/recalculate/result");
      } else {
        await completeOnboarding(request);
        router.push("/onboarding/result");
      }
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : isRecalculate
            ? "Não foi possível recalcular suas metas."
            : "Não foi possível salvar seu perfil.";
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleBack() {
    if (step === 0 || loading) return;
    setStep((current) => current - 1);
    setError(null);
  }

  const currentWeight = Number(form.weight.replace(",", ".")) || 0;
  const targetWeight = Number(form.targetWeight.replace(",", ".")) || 0;
  const weightDelta =
    currentWeight > 0 && targetWeight > 0
      ? Math.round((targetWeight - currentWeight) * 10) / 10
      : null;

  return (
    <div
      className={cn(
        "bg-background",
        showSidePanel ? "min-h-dvh lg:grid lg:grid-cols-2" : "",
      )}
    >
      {showSidePanel ? (
        <OnboardingSidePanel mode={mode} step={step} />
      ) : null}

      <div
        className={cn(
          "flex flex-col px-4 py-6 sm:px-6",
          showSidePanel
            ? "min-h-dvh pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] lg:justify-center lg:py-10 lg:pl-10 lg:pr-12"
            : "pb-4 lg:max-w-3xl lg:px-8",
        )}
      >
        <OnboardingShell
          mode={mode}
          step={step}
          progress={progress}
          backHref={backHref}
          backLabel={backLabel}
          loading={loading}
          onBack={handleBack}
          onNext={handleNext}
          nextLabel={nextLabel}
          canGoBack={step > 0}
          error={error}
        >
          {step === 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {GOAL_OPTIONS.map((option) => (
                <OptionCard
                  key={option.value}
                  label={option.label}
                  description={option.description}
                  icon={option.icon}
                  selected={form.goal === option.value}
                  onSelect={() => updateForm({ goal: option.value })}
                />
              ))}
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid grid-cols-3 gap-3">
              {GENDER_OPTIONS.map((option) => (
                <OptionCard
                  key={option.value}
                  label={option.label}
                  icon={option.icon}
                  selected={form.gender === option.value}
                  onSelect={() => updateForm({ gender: option.value })}
                  className="min-h-[5rem] items-center text-center [&>div:first-child]:mx-auto [&>div:last-child]:w-full [&>div:last-child]:text-center"
                />
              ))}
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <MetricField
                id="age"
                label="Idade"
                suffix="anos"
                inputMode="numeric"
                value={form.age}
                onChange={(value) => updateForm({ age: value })}
              />
              <MetricField
                id="height"
                label="Altura"
                suffix="m"
                inputMode="decimal"
                placeholder="1,75"
                hint="Use vírgula ou ponto decimal."
                value={form.height}
                onChange={(value) => updateForm({ height: value })}
              />
              <MetricField
                id="weight"
                label="Peso atual"
                suffix="kg"
                inputMode="decimal"
                value={form.weight}
                onChange={(value) => updateForm({ weight: value })}
                className="sm:col-span-2"
              />
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-4">
              {currentWeight > 0 ? (
                <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/40 p-4">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-background text-muted-foreground shadow-xs">
                    <Scale className="size-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Peso atual
                    </p>
                    <p className="text-lg font-semibold tabular-nums">
                      {currentWeight} kg
                    </p>
                  </div>
                  {weightDelta !== null && form.targetWeight ? (
                    <div className="ml-auto text-right">
                      <p className="text-xs text-muted-foreground">Diferença</p>
                      <p
                        className={cn(
                          "text-sm font-semibold tabular-nums",
                          weightDelta < 0 && "text-primary",
                          weightDelta > 0 && "text-warning",
                          weightDelta === 0 && "text-muted-foreground",
                        )}
                      >
                        {weightDelta > 0 ? "+" : ""}
                        {weightDelta} kg
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : null}
              <MetricField
                id="targetWeight"
                label="Peso meta"
                suffix="kg"
                inputMode="decimal"
                value={form.targetWeight}
                onChange={(value) => updateForm({ targetWeight: value })}
              />
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-3">
              {ROUTINE_OPTIONS.map((option) => (
                <SelectionTile
                  key={option.value}
                  title={option.title}
                  description={option.description}
                  icon={option.icon}
                  selected={form.dailyRoutineLevel === option.value}
                  onSelect={() =>
                    updateForm({ dailyRoutineLevel: option.value })
                  }
                />
              ))}
            </div>
          ) : null}

          {step === 5 ? (
            <div className="space-y-3">
              {ACTIVITY_OPTIONS.map((option) => (
                <SelectionTile
                  key={option.value}
                  title={option.title}
                  description={option.description}
                  icon={option.icon}
                  selected={form.activityLevel === option.value}
                  onSelect={() =>
                    updateForm({
                      activityLevel: option.value as ActivityLevelType,
                    })
                  }
                />
              ))}
            </div>
          ) : null}

          {step === 6 ? (
            <div className="space-y-3">
              {INTENSITY_OPTIONS.map((option) => (
                <SelectionTile
                  key={option.value}
                  title={option.title}
                  description={option.description}
                  icon={option.icon}
                  selected={form.goalIntensity === option.value}
                  onSelect={() => updateForm({ goalIntensity: option.value })}
                />
              ))}
            </div>
          ) : null}
        </OnboardingShell>
      </div>
    </div>
  );
}
