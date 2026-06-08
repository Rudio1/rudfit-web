import { cn } from "@/lib/utils";

interface QuantityProgressBarProps {
  consumed: number;
  goal: number;
  percent: number;
  unit?: string;
  barColorVar: string;
  trackColorVar: string;
  formatValue?: (value: number) => string;
  ariaLabel: string;
  showValues?: boolean;
  className?: string;
}

function defaultFormat(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function QuantityProgressBar({
  consumed,
  goal,
  percent,
  unit = "",
  barColorVar,
  trackColorVar,
  formatValue = defaultFormat,
  ariaLabel,
  showValues = true,
  className,
}: QuantityProgressBarProps) {
  const unitSuffix = unit ? ` ${unit}` : "";
  const fillWidth = percent <= 0 ? 0 : Math.max(percent, 4);

  return (
    <div className={cn("space-y-2", className)}>
      {showValues ? (
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-medium tabular-nums text-foreground">
            {formatValue(consumed)}
            {unitSuffix}
            <span className="font-normal text-muted-foreground">
              {" "}
              / {formatValue(goal)}
              {unitSuffix}
            </span>
          </span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold tabular-nums text-foreground">
            {percent}%
          </span>
        </div>
      ) : null}
      <div
        className="h-2.5 w-full overflow-hidden rounded-full border border-border/60"
        style={{ backgroundColor: `var(${trackColorVar})` }}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel}
      >
        <div
          className="h-full min-w-0 rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${fillWidth}%`,
            backgroundColor: `var(${barColorVar})`,
          }}
        />
      </div>
    </div>
  );
}
