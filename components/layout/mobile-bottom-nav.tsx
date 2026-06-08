"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera } from "lucide-react";
import { isNavActive, NAV_ITEMS } from "@/lib/layout/nav-items";
import { cn } from "@/lib/utils";

const HIDDEN_PATHS = ["/meals/add"];

export function MobileBottomNav() {
  const pathname = usePathname();

  if (HIDDEN_PATHS.some((path) => pathname.startsWith(path))) {
    return null;
  }

  const leftItems = NAV_ITEMS.slice(0, 2);
  const rightItems = NAV_ITEMS.slice(2);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bottom-nav/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-1px_3px_rgb(15_23_42_/_0.06)] backdrop-blur-md lg:hidden"
      aria-label="Navegação principal"
    >
      <div className="mx-auto grid h-[4.25rem] max-w-lg grid-cols-5 items-end px-2">
        {leftItems.map((item) => {
          const active = isNavActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "action-link relative flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-lg px-1 text-[10px] font-medium transition-colors",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {active ? (
                <span className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-primary" />
              ) : null}
              <Icon className="size-5 shrink-0" aria-hidden />
              {item.label}
            </Link>
          );
        })}

        <div className="flex justify-center pb-1.5">
          <Link
            href="/meals/add"
            aria-label="Adicionar refeição com IA"
            className="action-link flex size-[3.25rem] -translate-y-2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform hover:bg-primary/90 active:scale-95"
          >
            <Camera className="size-5" aria-hidden />
          </Link>
        </div>

        {rightItems.map((item) => {
          const active = isNavActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "action-link relative flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-lg px-1 text-[10px] font-medium transition-colors",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {active ? (
                <span className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-primary" />
              ) : null}
              <Icon className="size-5 shrink-0" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
