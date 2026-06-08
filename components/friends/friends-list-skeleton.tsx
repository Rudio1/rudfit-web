import { PageScaffold } from "@/components/layout/page-scaffold";
import { Skeleton } from "@/components/ui/skeleton";

export function FriendsListSkeleton() {
  return (
    <PageScaffold title="Amigos" subtitle="Carregando seus amigos...">
      <div className="grid gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="surface-card flex items-center gap-4 p-4"
          >
            <Skeleton className="size-14 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </PageScaffold>
  );
}
