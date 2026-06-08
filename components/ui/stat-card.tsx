import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  trend?: "neutral" | "success" | "warning";
  className?: string;
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  trend = "neutral",
  className,
}: StatCardProps) {
  return (
    <div className={cn("surface-card p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        {Icon ? (
          <Icon
            className={cn(
              "size-4 shrink-0",
              trend === "success" && "text-success",
              trend === "warning" && "text-warning",
              trend === "neutral" && "text-muted-foreground",
            )}
            aria-hidden
          />
        ) : null}
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight">
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
