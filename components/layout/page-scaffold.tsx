import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ActionBar } from "@/components/ui/action-bar";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageScaffoldProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  stats?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function PageScaffold({
  title,
  subtitle,
  action,
  breadcrumbs,
  stats,
  children,
  className,
  contentClassName,
}: PageScaffoldProps) {
  return (
    <div className={cn("section-stack", className)}>
      <header className="space-y-4 border-b border-border pb-6">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5">
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;

              return (
                <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
                  {index > 0 ? (
                    <ChevronRight
                      className="size-3.5 text-muted-foreground/60"
                      aria-hidden
                    />
                  ) : null}
                  {item.href && !isLast ? (
                    <Link
                      href={item.href}
                      className="action-link text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      className={cn(
                        "text-sm",
                        isLast
                          ? "font-medium text-foreground"
                          : "text-muted-foreground",
                      )}
                      aria-current={isLast ? "page" : undefined}
                    >
                      {item.label}
                    </span>
                  )}
                </span>
              );
            })}
          </nav>
        ) : null}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-1">
            <h1 className="text-page-title">{title}</h1>
            {subtitle ? (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          {action ? <ActionBar variant="header">{action}</ActionBar> : null}
        </div>

        {stats ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{stats}</div>
        ) : null}
      </header>

      <div className={cn("section-stack", contentClassName)}>{children}</div>
    </div>
  );
}

interface LegalPageProps {
  title: string;
  headline: string;
  description: string;
  children: React.ReactNode;
}

export function LegalPage({
  title,
  headline,
  description,
  children,
}: LegalPageProps) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 lg:px-0">
      <Link
        href="/profile"
        className="mb-6 inline-flex text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Voltar
      </Link>
      <PageScaffold
        title={title}
        subtitle={headline}
        breadcrumbs={[
          { label: "Perfil", href: "/profile" },
          { label: title },
        ]}
      >
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
        <div className="grid gap-4">{children}</div>
      </PageScaffold>
    </div>
  );
}

export function LegalSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="surface-card p-5">
      <h2 className="text-section-title">{title}</h2>
      {subtitle ? (
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      ) : null}
      <ul className="mt-4 space-y-3">{children}</ul>
    </section>
  );
}

export function LegalBullet({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <li>
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </li>
  );
}
