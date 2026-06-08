import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptionCardProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
  className?: string;
}

export function OptionCard({
  label,
  selected,
  onSelect,
  className,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "action-link flex min-h-24 flex-col items-center justify-center rounded-xl border p-4 text-center text-sm font-medium transition-all",
        selected
          ? "border-primary bg-primary/5 text-foreground shadow-xs ring-1 ring-primary/20"
          : "border-border bg-card text-foreground hover:border-primary/30 hover:bg-muted/40",
        className,
      )}
    >
      {label}
      {selected ? (
        <CheckCircle2 className="mt-2 size-5 text-primary" aria-hidden />
      ) : null}
    </button>
  );
}

interface SelectionTileProps {
  title: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
}

export function SelectionTile({
  title,
  description,
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
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium">{title}</p>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {selected ? (
          <CheckCircle2 className="size-5 shrink-0 text-primary" aria-hidden />
        ) : null}
      </div>
    </button>
  );
}
