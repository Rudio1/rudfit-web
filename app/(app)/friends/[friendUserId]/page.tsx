import { Suspense } from "react";
import { DailyComparisonView } from "@/components/friends/daily-comparison-view";
import { DailyComparisonSkeleton } from "@/components/friends/daily-comparison-skeleton";

interface FriendComparisonPageProps {
  params: Promise<{ friendUserId: string }>;
}

export default async function FriendComparisonPage({
  params,
}: FriendComparisonPageProps) {
  const { friendUserId } = await params;

  return (
    <Suspense fallback={<DailyComparisonSkeleton />}>
      <DailyComparisonView friendUserId={friendUserId} />
    </Suspense>
  );
}
