import { FREE_SCANNER_LIFETIME_LIMIT } from "@/lib/subscriptions/constants";
import { cn } from "@/lib/utils";

interface FreeScannerUsesHintProps {
  remaining: number;
  className?: string;
}

function getMessage(remaining: number): string {
  if (remaining <= 0) {
    return `Limite gratuito de ${FREE_SCANNER_LIFETIME_LIMIT} análises por foto atingido.`;
  }

  if (remaining === 1) {
    return `1 uso grátis do scanner restante (de ${FREE_SCANNER_LIFETIME_LIMIT}).`;
  }

  return `${remaining} usos grátis do scanner restantes (de ${FREE_SCANNER_LIFETIME_LIMIT}).`;
}

export function FreeScannerUsesHint({
  remaining,
  className,
}: FreeScannerUsesHintProps) {
  const depleted = remaining <= 0;

  return (
    <p
      className={cn(
        "text-sm font-medium",
        depleted ? "text-muted-foreground" : "text-primary",
        className,
      )}
    >
      {getMessage(remaining)}
    </p>
  );
}
