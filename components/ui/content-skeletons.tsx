import { Skeleton } from "@/components/ui/skeleton";

export function MealCardSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border p-3">
      <Skeleton className="size-16 shrink-0 rounded-xl" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="h-3 w-10" />
    </div>
  );
}

export function MealListSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Carregando refeições">
      {Array.from({ length: count }).map((_, index) => (
        <MealCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-36" />
    </div>
  );
}
