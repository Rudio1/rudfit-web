import { CheckCircle2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptionCardProps {
  label: string;
  description?: string;
  icon?: LucideIcon;
  selected: boolean;
  onSelect: () => void;
  className?: string;
}

export function OptionCard({
  label,
  description,
  icon: Icon,
  selected,
  onSelect,
  className,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "action-link flex min-h-[5.5rem] flex-col items-start justify-between rounded-xl border p-4 text-left transition-all",
        selected
          ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/20"
          : "border-border bg-card hover:border-primary/30 hover:bg-muted/40",
        className,
      )}
    >
      <div className="flex w-full items-start justify-between gap-2">
        {Icon ? (
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-lg",
              selected
                ? "bg-primary/15 text-primary"
                : "bg-muted text-muted-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden />
          </span>
        ) : null}
        {selected ? (
          <CheckCircle2 className="size-5 shrink-0 text-primary" aria-hidden />
        ) : null}
      </div>
      <div className="mt-3 w-full">
        <p className="text-sm font-semibold">{label}</p>
        {description ? (
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
    </button>
  );
}

interface SelectionTileProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  selected: boolean;
  onSelect: () => void;
}

export function SelectionTile({
  title,
  description,
  icon: Icon,
  selected,
  onSelect,
}: SelectionTileProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "action-link w-full rounded-xl border p-4 text-left transition-all",
        selected
          ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/20"
          : "border-border bg-card hover:border-primary/30 hover:bg-muted/40",
      )}
    >
      <div className="flex items-start gap-3">
        {Icon ? (
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg",
              selected
                ? "bg-primary/15 text-primary"
                : "bg-muted text-muted-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden />
          </span>
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="font-medium">{title}</p>
            {selected ? (
              <CheckCircle2
                className="size-5 shrink-0 text-primary"
                aria-hidden
              />
            ) : null}
          </div>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </div>
    </button>
  );
}

interface MetricFieldProps {
  id: string;
  label: string;
  suffix: string;
  hint?: string;
  inputMode?: "numeric" | "decimal";
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function MetricField({
  id,
  label,
  suffix,
  hint,
  inputMode = "numeric",
  placeholder,
  value,
  onChange,
  className,
}: MetricFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          inputMode={inputMode}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex h-11 w-full rounded-lg border border-input bg-background px-3 pr-14 text-base tabular-nums shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
        />
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm font-medium text-muted-foreground">
          {suffix}
        </span>
      </div>
      {hint ? <p className="text-caption">{hint}</p> : null}
    </div>
  );
}
