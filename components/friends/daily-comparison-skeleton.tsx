import { PageScaffold } from "@/components/layout/page-scaffold";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DailyComparisonSkeleton() {
  return (
    <PageScaffold title="Comparação" subtitle="Carregando progresso do dia...">
      <Skeleton className="h-14 w-full rounded-xl" />
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              <Skeleton className="size-[200px] rounded-full mx-auto" />
              <Skeleton className="h-2.5 w-full rounded-full" />
              <Skeleton className="h-2.5 w-full rounded-full" />
              <Skeleton className="h-2.5 w-full rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </PageScaffold>
  );
}
