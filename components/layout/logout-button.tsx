"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { clearSession } from "@/lib/auth/session";
import { messageService } from "@/lib/services/message-service";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

type LogoutButtonVariant = "default" | "icon" | "sidebar" | "footer";

interface LogoutButtonProps {
  variant?: LogoutButtonVariant;
  className?: string;
  onLoggedOut?: () => void;
}

export function LogoutButton({
  variant = "default",
  className,
  onLoggedOut,
}: LogoutButtonProps) {
  const router = useRouter();

  async function handleLogout() {
    const confirmed = await messageService.confirmLogout();
    if (!confirmed) return;

    clearSession();
    onLoggedOut?.();
    router.push("/login");
    router.refresh();
  }

  if (variant === "icon") {
    return (
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={cn("shrink-0", className)}
        aria-label="Sair da conta"
        onClick={handleLogout}
      >
        <LogOut className="size-4" aria-hidden />
      </Button>
    );
  }

  if (variant === "sidebar") {
    return (
      <button
        type="button"
        onClick={handleLogout}
        className={cn(
          buttonVariants({ variant: "outline", size: "lg" }),
          "action-link h-10 w-full justify-center gap-2 shadow-xs",
          className,
        )}
      >
        <LogOut className="size-4 shrink-0" aria-hidden />
        Sair da conta
      </button>
    );
  }

  if (variant === "footer") {
    return (
      <Button
        type="button"
        variant="outline"
        size="lg"
        className={className}
        onClick={handleLogout}
      >
        <LogOut className="size-4" aria-hidden />
        Sair da conta
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn("shrink-0 gap-1.5 shadow-xs", className)}
      onClick={handleLogout}
    >
      <LogOut className="size-4 shrink-0" aria-hidden />
      Sair
    </Button>
  );
}
