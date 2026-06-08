"use client";

import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { useProfile } from "@/lib/hooks/use-profile";
import { getInitials } from "@/lib/meals/progress";
import { cn } from "@/lib/utils";
import { DailyGoalsOverview } from "@/components/goals/daily-goals-overview";
import { PageScaffold } from "@/components/layout/page-scaffold";
import { ProfilePageSkeleton } from "@/components/profile/profile-page-skeleton";
import { ProfileWeightEditor } from "@/components/profile/profile-weight-editor";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const { profile, displayName, loading } = useProfile();

  if (loading) {
    return <ProfilePageSkeleton />;
  }

  const initials = profile?.name
    ? getInitials(profile.name)
    : displayName.slice(0, 2).toUpperCase();

  return (
    <PageScaffold
      title="Perfil"
      subtitle="Sua conta e metas diárias"
      breadcrumbs={[{ label: "Início", href: "/" }, { label: "Perfil" }]}
    >
      {profile ? (
        <DailyGoalsOverview
          goals={{
            dailyCaloriesGoal: profile.dailyCaloriesGoal,
            dailyProteinGoal: profile.dailyProteinGoal,
            dailyCarbsGoal: profile.dailyCarbsGoal,
            dailyFatGoal: profile.dailyFatGoal,
          }}
        />
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Card className="shadow-xs">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="text-section-title">Conta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex items-center gap-4">
                {profile?.profileImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.profileImageUrl}
                    alt=""
                    className="size-16 rounded-full object-cover ring-1 ring-border"
                  />
                ) : (
                  <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                    {initials}
                  </div>
                )}
                <div>
                  <p className="text-lg font-semibold">
                    {profile?.name ?? displayName}
                  </p>
                  {profile?.username ? (
                    <p className="text-sm text-muted-foreground">
                      @{profile.username}
                    </p>
                  ) : null}
                </div>
              </div>

              {profile ? (
                <dl className="grid gap-4 text-sm sm:grid-cols-2">
                  <div className="rounded-lg border border-border/60 bg-card-elevated/50 p-4">
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      E-mail
                    </dt>
                    <dd className="mt-1 font-medium">{profile.email}</dd>
                  </div>
                  <ProfileWeightEditor profile={profile} />
                </dl>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Não foi possível carregar todos os dados da conta. Você ainda
                  pode usar o app normalmente.
                </p>
              )}
            </CardContent>
          </Card>

          {profile ? (
            <Card className="shadow-xs">
              <CardHeader className="border-b border-border pb-4">
                <CardTitle className="text-section-title">
                  Metas diárias
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Revise objetivo, medidas e hábitos como no cadastro. Ao
                  concluir, suas calorias e macros do dia serão recalculados no
                  servidor.
                </p>
                <Link
                  href="/profile/recalculate"
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "lg" }),
                    "w-full sm:w-auto",
                  )}
                >
                  <RefreshCw className="size-4" />
                  Recalcular metas
                </Link>
              </CardContent>
            </Card>
          ) : null}
        </div>

        <div className="space-y-6">
          <Card className="shadow-xs">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="text-section-title">Legal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 pt-4">
              <Link
                href="/legal/privacy"
                className="action-link flex min-h-10 items-center rounded-lg px-3 text-sm text-foreground transition-colors hover:bg-muted"
              >
                Política de Privacidade
              </Link>
              <Link
                href="/legal/ai-transparency"
                className="action-link flex min-h-10 items-center rounded-lg px-3 text-sm text-foreground transition-colors hover:bg-muted"
              >
                Uso de IA
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageScaffold>
  );
}
