import { formatMacroValue, macroPercent } from "@/lib/meals/progress";
import { QuantityProgressBar } from "@/components/home/quantity-progress-bar";

interface MacroProgressSectionProps {
  protein: { consumed: number; goal: number };
  carbs: { consumed: number; goal: number };
  fat: { consumed: number; goal: number };
}

const MACROS = [
  {
    key: "protein" as const,
    label: "Proteína",
    barColorVar: "--macro-protein",
    trackColorVar: "--macro-protein-track",
  },
  {
    key: "carbs" as const,
    label: "Carboidratos",
    barColorVar: "--macro-carbs",
    trackColorVar: "--macro-carbs-track",
  },
  {
    key: "fat" as const,
    label: "Gorduras",
    barColorVar: "--macro-fat",
    trackColorVar: "--macro-fat-track",
  },
];

export function MacroProgressSection({
  protein,
  carbs,
  fat,
}: MacroProgressSectionProps) {
  const values = { protein, carbs, fat };

  return (
    <div className="grid gap-5 md:grid-cols-1">
      {MACROS.map((macro) => {
        const data = values[macro.key];
        const percent = macroPercent(data.consumed, data.goal);

        return (
          <div
            key={macro.key}
            className="rounded-lg border border-border/60 bg-card-elevated/50 p-4"
          >
            <div className="mb-3 flex items-baseline justify-between gap-2">
              <p className="text-sm font-medium">{macro.label}</p>
              <p className="text-xs tabular-nums text-muted-foreground">
                {formatMacroValue(data.consumed)} / {formatMacroValue(data.goal)} g
              </p>
            </div>
            <QuantityProgressBar
              consumed={data.consumed}
              goal={data.goal}
              percent={percent}
              unit="g"
              barColorVar={macro.barColorVar}
              trackColorVar={macro.trackColorVar}
              formatValue={formatMacroValue}
              ariaLabel={`${macro.label}: ${percent}% da meta`}
            />
          </div>
        );
      })}
    </div>
  );
}
