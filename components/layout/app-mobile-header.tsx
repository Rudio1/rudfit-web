"use client";

import Link from "next/link";
import { Leaf } from "lucide-react";
import { LogoutButton } from "@/components/layout/logout-button";

export function AppMobileHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-md lg:hidden">
      <div className="flex h-14 items-center justify-between gap-3 px-4 pt-[env(safe-area-inset-top)]">
        <Link
          href="/"
          className="action-link flex min-w-0 items-center gap-2 transition-opacity hover:opacity-80"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Leaf className="size-4" aria-hidden />
          </span>
          <span className="truncate font-semibold tracking-tight">RudFit AI</span>
        </Link>
        <LogoutButton variant="default" />
      </div>
    </header>
  );
}
