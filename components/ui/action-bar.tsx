import { cn } from "@/lib/utils";

/** Largura padrão de botões/links de ação: full no mobile, auto no desktop. */
export const actionControlClass = "w-full sm:w-auto min-h-10";

type ActionBarVariant = "header" | "footer" | "inline" | "single";

interface ActionBarProps {
  children: React.ReactNode;
  variant?: ActionBarVariant;
  className?: string;
}

const variantClasses: Record<ActionBarVariant, string> = {
  header:
    "flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end sm:gap-3",
  footer:
    "flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3",
  inline:
    "flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end sm:gap-3",
  single:
    "flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-3",
};

const childControlClasses =
  "[&_[data-slot=button]]:w-full [&_a[data-slot=button]]:w-full [&_a:not([data-slot])]:w-full sm:[&_[data-slot=button]]:w-auto sm:[&_a[data-slot=button]]:w-auto sm:[&_a:not([data-slot])]:w-auto";

export function ActionBar({
  children,
  variant = "footer",
  className,
}: ActionBarProps) {
  return (
    <div
      className={cn(variantClasses[variant], childControlClasses, className)}
    >
      {children}
    </div>
  );
}
