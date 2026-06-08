import Link from "next/link";
import { Leaf } from "lucide-react";

export default function InviteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-background">
      <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-8 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <div className="mb-8 flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Leaf className="size-4" aria-hidden />
          </span>
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-foreground"
          >
            RudFit AI
          </Link>
        </div>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
