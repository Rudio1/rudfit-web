import { Suspense } from "react";
import { MealLogDetailPage } from "@/components/meals/meal-log-detail-page";
import { PageScaffold } from "@/components/layout/page-scaffold";
import { Skeleton } from "@/components/ui/skeleton";

interface MealDetailRouteProps {
  params: Promise<{ id: string }>;
}

function MealDetailFallback() {
  return (
    <PageScaffold title="Carregando refeição...">
      <Skeleton className="h-72 rounded-xl" />
    </PageScaffold>
  );
}

export default async function MealDetailRoute({ params }: MealDetailRouteProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<MealDetailFallback />}>
      <MealLogDetailPage mealId={id} />
    </Suspense>
  );
}
