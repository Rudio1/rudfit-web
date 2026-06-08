import { Leaf } from "lucide-react";
import {
  FIRST_ACCESS_TIPS,
  ONBOARDING_STEPS,
  RECALCULATE_TIPS,
} from "@/lib/onboarding/steps";

interface OnboardingSidePanelProps {
  mode?: "firstAccess" | "recalculate";
  step?: number;
}

export function OnboardingSidePanel({
  mode = "firstAccess",
  step = 0,
}: OnboardingSidePanelProps) {
  const isRecalculate = mode === "recalculate";
  const tips = isRecalculate ? RECALCULATE_TIPS : FIRST_ACCESS_TIPS;
  const currentStep = ONBOARDING_STEPS[step] ?? ONBOARDING_STEPS[0];
  const StepIcon = currentStep.icon;

  return (
    <aside className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
            <Leaf className="size-5" aria-hidden />
          </span>
          <span className="text-xl font-semibold tracking-tight">
            RudFit AI
          </span>
        </div>

        <div className="mt-14 max-w-md">
          <p className="text-sm font-medium uppercase tracking-wider text-primary-foreground/70">
            {isRecalculate ? "Atualizar plano" : "Bem-vindo"}
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight">
            {isRecalculate
              ? "Ajuste suas metas com precisão"
              : "Vamos montar seu plano nutricional"}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-primary-foreground/80">
            {isRecalculate
              ? "Revise objetivo, medidas e hábitos. Suas calorias e macros serão recalculados automaticamente."
              : "Responda algumas perguntas rápidas para calcular calorias e macronutrientes personalizados."}
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-white/15">
              <StepIcon className="size-5" aria-hidden />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-primary-foreground/70">
                Etapa atual
              </p>
              <p className="font-semibold">{currentStep.title}</p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-primary-foreground/75">
            {currentStep.subtitle}
          </p>
        </div>
      </div>

      <ul className="relative z-10 space-y-3 text-sm text-primary-foreground/75">
        {tips.map((tip) => (
          <li key={tip} className="flex items-start gap-2">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary-foreground/60" />
            {tip}
          </li>
        ))}
      </ul>

      <div
        className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-white/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 size-64 rounded-full bg-white/5"
        aria-hidden
      />
    </aside>
  );
}
