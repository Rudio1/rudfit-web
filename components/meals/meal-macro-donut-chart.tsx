import { formatMacro } from "@/lib/meals/macros";
import {
  getMacroBreakdown,
  getMacroDonutSegments,
} from "@/lib/meals/macro-breakdown";
import type { MacroTotals } from "@/lib/meals/macros";

interface MealMacroDonutChartProps {
  totals: MacroTotals;
}

export function MealMacroDonutChart({ totals }: MealMacroDonutChartProps) {
  const breakdown = getMacroBreakdown(totals);
  const segments = getMacroDonutSegments(breakdown);
  const size = 160;
  const stroke = 18;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex size-[160px] shrink-0 items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          role="img"
          aria-label="Distribuição de macronutrientes da refeição"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth={stroke}
          />
          {segments.length === 0 ? (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="var(--muted)"
              strokeWidth={stroke}
              strokeDasharray={`${circumference * 0.25} ${circumference}`}
            />
          ) : (
            segments.map((segment) => {
              const length = (segment.percent / 100) * circumference;
              const dashOffset = -offset;
              offset += length;

              return (
                <circle
                  key={segment.colorVar}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={`var(${segment.colorVar})`}
                  strokeWidth={stroke}
                  strokeLinecap="butt"
                  strokeDasharray={`${length} ${circumference}`}
                  strokeDashoffset={dashOffset}
                  className="transition-all duration-700 ease-out"
                />
              );
            })
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-2xl font-bold tabular-nums">
            {Math.round(totals.calories)}
          </p>
          <p className="text-xs text-muted-foreground">kcal total</p>
        </div>
      </div>

      <div className="grid w-full flex-1 gap-3 sm:max-w-xs">
        {breakdown.map((segment) => (
          <div key={segment.key} className="space-y-1.5">
            <div className="flex items-center justify-between gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: `var(${segment.colorVar})` }}
                />
                <span className="font-medium">{segment.label}</span>
              </div>
              <span className="tabular-nums text-muted-foreground">
                {formatMacro(segment.grams, "g")} · {segment.percent}%
              </span>
            </div>
            <div
              className="h-2 w-full overflow-hidden rounded-full border border-border/80"
              style={{ backgroundColor: `var(${segment.trackColorVar})` }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.max(segment.percent, segment.percent > 0 ? 6 : 0)}%`,
                  backgroundColor: `var(${segment.colorVar})`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
