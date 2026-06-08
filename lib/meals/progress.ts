export function macroPercent(consumed: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((consumed / goal) * 100));
}

export function macroRemaining(consumed: number, goal: number): number {
  return Math.max(0, goal - consumed);
}

export function formatMacroValue(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function getFirstName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "Usuário";
  return trimmed.split(/\s+/)[0] ?? trimmed;
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "R";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase();
}
