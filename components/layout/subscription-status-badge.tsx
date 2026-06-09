interface SubscriptionStatusBadgeProps {
  hasPremium: boolean;
}

export function SubscriptionStatusBadge({
  hasPremium,
}: SubscriptionStatusBadgeProps) {
  if (hasPremium) return null;

  return (
    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
      Grátis
    </span>
  );
}
