import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PageScaffold } from "@/components/layout/page-scaffold";

export function HomeDashboardSkeleton() {
  return (
    <PageScaffold title="Carregando..." subtitle="Preparando seu resumo">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-xl" />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <Card>
          <CardHeader className="border-b border-border pb-4">
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <Skeleton className="size-[200px] rounded-full" />
            <Skeleton className="h-4 w-48" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border pb-4">
            <Skeleton className="h-5 w-36" />
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <Skeleton className="h-2.5 w-full rounded-full" />
            <Skeleton className="h-2.5 w-full rounded-full" />
            <Skeleton className="h-2.5 w-full rounded-full" />
          </CardContent>
        </Card>
      </div>
    </PageScaffold>
  );
}
