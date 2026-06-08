import { UtensilsCrossed } from "lucide-react";
import type { FriendDaySnapshot } from "@/lib/types/friendships";
import { CalorieRingChart } from "@/components/home/calorie-ring-chart";
import { MacroProgressSection } from "@/components/home/macro-progress-section";
import { FriendAvatar } from "@/components/friends/friend-avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FriendDaySnapshotCardProps {
  snapshot: FriendDaySnapshot;
  label: string;
}

export function FriendDaySnapshotCard({
  snapshot,
  label,
}: FriendDaySnapshotCardProps) {
  const { goals, consumption, progress } = snapshot;

  return (
    <Card className="shadow-xs">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <FriendAvatar
            name={snapshot.name}
            profileImageUrl={snapshot.profileImageUrl}
            size="sm"
          />
          <div className="min-w-0">
            <CardTitle className="truncate text-section-title">{label}</CardTitle>
            <p className="truncate text-sm text-muted-foreground">
              {snapshot.name}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-card-elevated/50 px-3 py-2 text-sm">
          <UtensilsCrossed className="size-4 text-muted-foreground" aria-hidden />
          <span>
            <span className="font-medium">{consumption.mealsCount}</span>{" "}
            {consumption.mealsCount === 1 ? "refeição" : "refeições"} registradas
          </span>
        </div>

        <CalorieRingChart
          consumed={consumption.totalCalories}
          goal={goals.dailyCaloriesGoal}
          percent={progress.caloriesPercent}
        />

        <MacroProgressSection
          protein={{
            consumed: consumption.totalProtein,
            goal: goals.dailyProteinGoal,
          }}
          carbs={{
            consumed: consumption.totalCarbs,
            goal: goals.dailyCarbsGoal,
          }}
          fat={{
            consumed: consumption.totalFat,
            goal: goals.dailyFatGoal,
          }}
        />
      </CardContent>
    </Card>
  );
}
