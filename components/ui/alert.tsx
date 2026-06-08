import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const alertVariants = cva(
  "flex gap-3 rounded-xl border px-4 py-3 text-sm",
  {
    variants: {
      variant: {
        default: "border-border bg-card text-foreground",
        success:
          "border-success/20 bg-success/5 text-foreground [&_[data-slot=alert-icon]]:text-success",
        warning:
          "border-warning/20 bg-warning/5 text-foreground [&_[data-slot=alert-icon]]:text-warning",
        destructive:
          "border-destructive/20 bg-destructive/5 text-foreground [&_[data-slot=alert-icon]]:text-destructive",
        info: "border-ai/20 bg-ai/5 text-foreground [&_[data-slot=alert-icon]]:text-ai",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface AlertProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof alertVariants> {
  icon?: LucideIcon;
  title?: string;
}

export function Alert({
  className,
  variant,
  icon: Icon,
  title,
  children,
  ...props
}: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {Icon ? (
        <Icon
          data-slot="alert-icon"
          className="mt-0.5 size-4 shrink-0"
          aria-hidden
        />
      ) : null}
      <div className="min-w-0 flex-1 space-y-1">
        {title ? <p className="font-medium">{title}</p> : null}
        {children ? (
          <div className="text-muted-foreground [&_p]:leading-relaxed">
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}
