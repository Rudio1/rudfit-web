interface DailyGoalCalorieRingProps {
  calories: number;
}

export function DailyGoalCalorieRing({ calories }: DailyGoalCalorieRingProps) {
  const size = 200;
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative mx-auto flex size-[200px] items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        role="img"
        aria-label={`Meta diária de ${Math.round(calories)} calorias`}
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
          strokeDashoffset={0}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="text-3xl font-bold tabular-nums text-foreground">
          {Math.round(calories)}
        </p>
        <p className="text-sm text-muted-foreground">kcal / dia</p>
        <p className="mt-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          Meta diária
        </p>
      </div>
    </div>
  );
}
