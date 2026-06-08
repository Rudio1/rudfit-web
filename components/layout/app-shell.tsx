import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-dvh bg-background">
      <AppSidebar />
      <div className="flex min-h-dvh flex-col lg:pl-[var(--sidebar-width)]">
        <main className="flex-1 pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0">
          <div className="page-container">{children}</div>
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}
