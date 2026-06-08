import { QuantityProgressBar } from "@/components/home/quantity-progress-bar";

interface CalorieRingChartProps {
  consumed: number;
  goal: number;
  percent: number;
}

export function CalorieRingChart({
  consumed,
  goal,
  percent,
}: CalorieRingChartProps) {
  const size = 200;
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="space-y-5">
      <div className="relative mx-auto flex size-[200px] items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          role="img"
          aria-label={`${percent}% da meta calórica diária`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--macro-calories-track)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--macro-calories)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-3xl font-bold tabular-nums text-foreground">
            {Math.round(consumed)}
          </p>
          <p className="text-sm text-muted-foreground">
            de {Math.round(goal)} kcal
          </p>
          <p className="mt-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {percent}% da meta
          </p>
        </div>
      </div>

      <QuantityProgressBar
        consumed={consumed}
        goal={goal}
        percent={percent}
        unit="kcal"
        barColorVar="--macro-calories"
        trackColorVar="--macro-calories-track"
        formatValue={(value) => String(Math.round(value))}
        ariaLabel={`Calorias: ${percent}% da meta diária`}
      />
    </div>
  );
}
