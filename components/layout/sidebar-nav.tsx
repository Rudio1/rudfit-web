"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Camera, LogOut } from "lucide-react";
import { clearSession } from "@/lib/auth/session";
import { useProfile } from "@/lib/hooks/use-profile";
import { isNavActive, NAV_ITEMS } from "@/lib/layout/nav-items";
import { getInitials } from "@/lib/meals/progress";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface SidebarNavProps {
  onNavigate?: () => void;
  className?: string;
}

export function SidebarNav({ onNavigate, className }: SidebarNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, displayName, loading } = useProfile();

  function handleLogout() {
    clearSession();
    onNavigate?.();
    router.push("/login");
    router.refresh();
  }

  const initials = profile?.name
    ? getInitials(profile.name)
    : displayName.slice(0, 2).toUpperCase();

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="p-4">
        <Link
          href="/meals/add"
          onClick={onNavigate}
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-10 w-full justify-center gap-2 shadow-sm",
          )}
        >
          <Camera className="size-4" aria-hidden />
          Adicionar refeição
        </Link>
      </div>

      <nav className="flex-1 space-y-0.5 px-3" aria-label="Navegação principal">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Menu
        </p>
        {NAV_ITEMS.map((item) => {
          const active = isNavActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "action-link flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent font-medium text-primary ring-1 ring-primary/10"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/70",
              )}
            >
              <Icon className="size-[18px] shrink-0" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        {loading ? (
          <div className="flex items-center gap-3 px-2 py-1">
            <Skeleton className="size-9 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            {profile?.profileImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.profileImageUrl}
                alt=""
                className="size-9 rounded-full object-cover ring-1 ring-border"
              />
            ) : (
              <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {initials}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {displayName}
              </p>
              {profile?.username ? (
                <p className="truncate text-xs text-muted-foreground">
                  @{profile.username}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">Conta ativa</p>
              )}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="action-link mt-1 flex min-h-9 w-full items-center gap-3 rounded-lg px-3 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent/70 hover:text-foreground"
        >
          <LogOut className="size-[18px] shrink-0" aria-hidden />
          Sair
        </button>
      </div>
    </div>
  );
}
