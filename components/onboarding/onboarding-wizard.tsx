"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { completeOnboarding } from "@/lib/api/onboarding";
import { ApiError } from "@/lib/api/errors";
import { OptionCard, SelectionTile } from "@/components/onboarding/option-card";
import { ActionBar } from "@/components/ui/action-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  ActivityLevelType,
  GenderType,
  GoalType,
  INITIAL_ONBOARDING_STATE,
  type OnboardingFormState,
} from "@/lib/types/onboarding";

const STEP_COUNT = 7;

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<OnboardingFormState>(INITIAL_ONBOARDING_STATE);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const progress = useMemo(
    () => ((step + 1) / STEP_COUNT) * 100,
    [step],
  );

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

    if (step < STEP_COUNT - 1) {
      setStep((current) => current + 1);
      return;
    }

    await submitOnboarding();
  }

  async function submitOnboarding() {
    if (loading) return;

    const age = Number(form.age);
    const heightCm = Number(form.height.replace(",", ".")) * 100;
    const weight = Number(form.weight.replace(",", "."));
    const targetWeight = Number(form.targetWeight.replace(",", "."));

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

    setLoading(true);
    try {
      await completeOnboarding({
        goal: form.goal,
        gender: form.gender,
        age,
        height: heightCm,
        weight,
        startingWeight: weight,
        targetWeight,
        activityLevel: form.activityLevel,
        dailyRoutineLevel: form.dailyRoutineLevel,
        goalIntensity: form.goalIntensity,
      });
      router.push("/onboarding/result");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
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

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 py-8 lg:max-w-3xl lg:px-8">
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Passo {step + 1} de {STEP_COUNT}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      <div className="surface-card flex-1 p-6 lg:p-8">
        {step === 0 && (
          <StepShell
            title="Qual é o seu objetivo?"
            subtitle="Escolha o foco principal do seu plano."
          >
            <div className="grid grid-cols-2 gap-3">
              <OptionCard
                label="Perder peso"
                selected={form.goal === GoalType.LoseWeight}
                onSelect={() => updateForm({ goal: GoalType.LoseWeight })}
              />
              <OptionCard
                label="Ganhar músculo"
                selected={form.goal === GoalType.GainMuscle}
                onSelect={() => updateForm({ goal: GoalType.GainMuscle })}
              />
              <OptionCard
                label="Manter peso"
                selected={form.goal === GoalType.MaintainWeight}
                onSelect={() => updateForm({ goal: GoalType.MaintainWeight })}
              />
              <OptionCard
                label="Recomposição corporal"
                selected={form.goal === GoalType.BodyRecomposition}
                onSelect={() =>
                  updateForm({ goal: GoalType.BodyRecomposition })
                }
              />
            </div>
          </StepShell>
        )}

        {step === 1 && (
          <StepShell
            title="Qual é o seu sexo biológico?"
            subtitle="Usado para calcular suas necessidades calóricas."
          >
            <div className="grid grid-cols-3 gap-3">
              <OptionCard
                label="Masculino"
                selected={form.gender === GenderType.Male}
                onSelect={() => updateForm({ gender: GenderType.Male })}
              />
              <OptionCard
                label="Feminino"
                selected={form.gender === GenderType.Female}
                onSelect={() => updateForm({ gender: GenderType.Female })}
              />
              <OptionCard
                label="Outro"
                selected={form.gender === GenderType.Other}
                onSelect={() => updateForm({ gender: GenderType.Other })}
              />
            </div>
          </StepShell>
        )}

        {step === 2 && (
          <StepShell
            title="Suas medidas"
            subtitle="Precisamos delas para calcular suas metas."
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="age">Idade</Label>
                <Input
                  id="age"
                  inputMode="numeric"
                  value={form.age}
                  onChange={(e) => updateForm({ age: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Altura (m)</Label>
                <Input
                  id="height"
                  inputMode="decimal"
                  placeholder="1,75"
                  value={form.height}
                  onChange={(e) => updateForm({ height: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Peso atual (kg)</Label>
                <Input
                  id="weight"
                  inputMode="decimal"
                  value={form.weight}
                  onChange={(e) => updateForm({ weight: e.target.value })}
                />
              </div>
            </div>
          </StepShell>
        )}

        {step === 3 && (
          <StepShell
            title="Qual é o seu peso meta?"
            subtitle="Usaremos isso para ajustar seu plano."
          >
            <div className="space-y-2">
              <Label htmlFor="targetWeight">Peso meta (kg)</Label>
              <Input
                id="targetWeight"
                inputMode="decimal"
                value={form.targetWeight}
                onChange={(e) => updateForm({ targetWeight: e.target.value })}
              />
            </div>
          </StepShell>
        )}

        {step === 4 && (
          <StepShell
            title="Como é sua rotina durante o dia?"
            subtitle="Independente dos seus treinos."
          >
            <div className="space-y-3">
              <SelectionTile
                title="Maioria do tempo sentado"
                description="Pouca movimentação ao longo do dia."
                selected={form.dailyRoutineLevel === 1}
                onSelect={() => updateForm({ dailyRoutineLevel: 1 })}
              />
              <SelectionTile
                title="Caminho e me movimento algumas vezes"
                description="Levanto com frequência ou faço pequenos deslocamentos."
                selected={form.dailyRoutineLevel === 2}
                onSelect={() => updateForm({ dailyRoutineLevel: 2 })}
              />
              <SelectionTile
                title="Passo boa parte do dia em pé"
                description="Trabalho ou rotina exige ficar em pé constantemente."
                selected={form.dailyRoutineLevel === 3}
                onSelect={() => updateForm({ dailyRoutineLevel: 3 })}
              />
              <SelectionTile
                title="Faço esforço físico frequentemente"
                description="Atividades físicas exigentes como parte do dia."
                selected={form.dailyRoutineLevel === 4}
                onSelect={() => updateForm({ dailyRoutineLevel: 4 })}
              />
            </div>
          </StepShell>
        )}

        {step === 5 && (
          <StepShell
            title="Nível de atividade"
            subtitle="Com que frequência você se exercita?"
          >
            <div className="space-y-3">
              <SelectionTile
                title="Sedentário"
                description="Pouco ou nenhum exercício"
                selected={form.activityLevel === ActivityLevelType.Sedentary}
                onSelect={() =>
                  updateForm({ activityLevel: ActivityLevelType.Sedentary })
                }
              />
              <SelectionTile
                title="Levemente ativo"
                description="1–3 dias de exercício por semana"
                selected={
                  form.activityLevel === ActivityLevelType.LightlyActive
                }
                onSelect={() =>
                  updateForm({ activityLevel: ActivityLevelType.LightlyActive })
                }
              />
              <SelectionTile
                title="Moderadamente ativo"
                description="3–5 dias de exercício por semana"
                selected={
                  form.activityLevel === ActivityLevelType.ModeratelyActive
                }
                onSelect={() =>
                  updateForm({
                    activityLevel: ActivityLevelType.ModeratelyActive,
                  })
                }
              />
              <SelectionTile
                title="Muito ativo"
                description="6–7 dias de exercício por semana"
                selected={form.activityLevel === ActivityLevelType.VeryActive}
                onSelect={() =>
                  updateForm({ activityLevel: ActivityLevelType.VeryActive })
                }
              />
              <SelectionTile
                title="Atleta"
                description="Exercício intenso diário"
                selected={form.activityLevel === ActivityLevelType.Athlete}
                onSelect={() =>
                  updateForm({ activityLevel: ActivityLevelType.Athlete })
                }
              />
            </div>
          </StepShell>
        )}

        {step === 6 && (
          <StepShell
            title="Qual ritmo você prefere seguir?"
            subtitle="Isso ajusta a intensidade do seu plano."
          >
            <div className="space-y-3">
              <SelectionTile
                title="Leve e sustentável"
                description="Mudanças graduais e mais fáceis de manter."
                selected={form.goalIntensity === 1}
                onSelect={() => updateForm({ goalIntensity: 1 })}
              />
              <SelectionTile
                title="Equilibrado"
                description="Bom progresso mantendo equilíbrio."
                selected={form.goalIntensity === 2}
                onSelect={() => updateForm({ goalIntensity: 2 })}
              />
              <SelectionTile
                title="Mais intenso"
                description="Resultados mais rápidos com maior disciplina."
                selected={form.goalIntensity === 3}
                onSelect={() => updateForm({ goalIntensity: 3 })}
              />
            </div>
          </StepShell>
        )}

        {error ? (
          <p className="mt-4 text-sm text-destructive">{error}</p>
        ) : null}
      </div>

      <ActionBar
        variant="footer"
        className="mt-6 border-t-0 pt-0 sm:border-t sm:pt-4 pb-[env(safe-area-inset-bottom)]"
      >
        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={step === 0 || loading}
          onClick={handleBack}
        >
          Voltar
        </Button>
        <Button
          type="button"
          size="lg"
          className="shadow-sm"
          disabled={loading}
          onClick={handleNext}
        >
          {loading
            ? "Salvando..."
            : step === STEP_COUNT - 1
              ? "Finalizar"
              : "Continuar"}
        </Button>
      </ActionBar>
    </div>
  );
}

function StepShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-page-title">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
