import Link from "next/link";
import { Leaf } from "lucide-react";
import { SidebarNav } from "@/components/layout/sidebar-nav";

export function AppSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[var(--sidebar-width)] flex-col border-r border-sidebar-border bg-sidebar shadow-sm lg:flex">
      <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-sidebar-border px-5">
        <Link
          href="/"
          className="action-link flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Leaf className="size-4" aria-hidden />
          </span>
          <span className="font-semibold tracking-tight text-sidebar-foreground">
            RudFit AI
          </span>
        </Link>
      </div>
      <SidebarNav className="flex-1" />
    </aside>
  );
}
