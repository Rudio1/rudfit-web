import Link from "next/link";
import { Leaf } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-background">
      <div className="grid min-h-dvh lg:grid-cols-2">
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                <Leaf className="size-5" aria-hidden />
              </span>
              <span className="text-xl font-semibold tracking-tight">
                RudFit AI
              </span>
            </div>
            <div className="mt-16 max-w-md">
              <h1 className="text-3xl font-semibold leading-tight tracking-tight text-primary-foreground">
                Nutrição inteligente para o seu dia a dia
              </h1>
              <p className="mt-4 text-base leading-relaxed text-primary-foreground/80">
                Acompanhe calorias e macros, registre refeições com IA e mantenha
                suas metas sob controle em qualquer dispositivo.
              </p>
            </div>
          </div>
          <ul className="relative z-10 space-y-3 text-sm text-primary-foreground/75">
            <li>Scanner de refeições com inteligência artificial</li>
            <li>Metas personalizadas de calorias e macronutrientes</li>
            <li>Dashboard completo para acompanhar seu progresso</li>
          </ul>
          <div
            className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-white/10"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-16 -left-16 size-64 rounded-full bg-white/5"
            aria-hidden
          />
        </aside>

        <div className="flex flex-col items-center justify-center px-4 py-8 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Leaf className="size-4" aria-hidden />
            </span>
            <span className="text-lg font-semibold tracking-tight">RudFit AI</span>
          </div>
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
