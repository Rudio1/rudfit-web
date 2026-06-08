import { Suspense } from "react";
import { MealsDayView } from "@/components/meals/meals-day-view";
import { PageScaffold } from "@/components/layout/page-scaffold";
import { MealListSkeleton } from "@/components/ui/content-skeletons";

function MealsPageFallback() {
  return (
    <PageScaffold title="Refeições" subtitle="Carregando suas refeições...">
      <MealListSkeleton count={3} />
    </PageScaffold>
  );
}

export default function MealsPage() {
  return (
    <Suspense fallback={<MealsPageFallback />}>
      <MealsDayView />
    </Suspense>
  );
}
