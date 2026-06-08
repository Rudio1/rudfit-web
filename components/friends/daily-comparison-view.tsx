"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RefreshCw, UserMinus } from "lucide-react";
import { toast } from "sonner";
import {
  getDailyComparison,
  getFriend,
  getFriendMealLogs,
  removeFriend,
} from "@/lib/api/friendships";
import { ApiError } from "@/lib/api/errors";
import {
  formatDateParam,
  isFutureDate,
  isToday,
  parseDateParam,
  startOfDay,
} from "@/lib/meals/dates";
import type { DailyComparisonResponse, Friendship } from "@/lib/types/friendships";
import type { MealLog } from "@/lib/types/meals";
import { FriendMealLogsSection } from "@/components/friends/friend-meal-logs-section";
import { messageService } from "@/lib/services/message-service";
import { DailyComparisonSkeleton } from "@/components/friends/daily-comparison-skeleton";
import { FriendDaySnapshotCard } from "@/components/friends/friend-day-snapshot-card";
import { MealsDatePicker } from "@/components/meals/meals-date-picker";
import { PageScaffold } from "@/components/layout/page-scaffold";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface DailyComparisonViewProps {
  friendUserId: string;
}

function getInitialDate(searchParams: URLSearchParams): Date {
  const param = searchParams.get("date");
  if (param) {
    const parsed = parseDateParam(param);
    if (parsed && !isFutureDate(parsed)) return parsed;
  }
  return startOfDay(new Date());
}

export function DailyComparisonView({ friendUserId }: DailyComparisonViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedDate, setSelectedDate] = useState(() =>
    getInitialDate(searchParams),
  );
  const [friend, setFriend] = useState<Friendship | null>(null);
  const [comparison, setComparison] = useState<DailyComparisonResponse | null>(
    null,
  );
  const [friendMealLogs, setFriendMealLogs] = useState<MealLog[]>([]);
  const [mealLogsLoading, setMealLogsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [removing, setRemoving] = useState(false);

  const dateParam = formatDateParam(selectedDate);

  const syncDateInUrl = useCallback(
    (date: Date) => {
      const nextParam = formatDateParam(date);
      const params = new URLSearchParams(searchParams.toString());

      if (isToday(date)) {
        params.delete("date");
      } else {
        params.set("date", nextParam);
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  const handleSelectDate = useCallback(
    (date: Date) => {
      const normalized = startOfDay(date);
      setSelectedDate(normalized);
      syncDateInUrl(normalized);
    },
    [syncDateInUrl],
  );

  useEffect(() => {
    const param = searchParams.get("date");

    if (!param) {
      setSelectedDate(startOfDay(new Date()));
      return;
    }

    const parsed = parseDateParam(param);
    if (parsed && !isFutureDate(parsed)) {
      setSelectedDate(parsed);
    }
  }, [searchParams]);

  const loadComparison = useCallback(
    async (showFullLoading: boolean) => {
      if (showFullLoading) {
        setLoading(true);
        setMealLogsLoading(true);
      } else {
        setRefreshing(true);
        setMealLogsLoading(true);
      }

      try {
        const [friendResult, comparisonResult, mealLogsResult] =
          await Promise.allSettled([
            getFriend(friendUserId),
            getDailyComparison(friendUserId, dateParam),
            getFriendMealLogs(friendUserId, dateParam),
          ]);

        if (friendResult.status === "rejected") {
          throw friendResult.reason;
        }
        if (comparisonResult.status === "rejected") {
          throw comparisonResult.reason;
        }

        setFriend(friendResult.value);
        setComparison(comparisonResult.value);

        if (mealLogsResult.status === "fulfilled") {
          setFriendMealLogs(mealLogsResult.value);
        } else {
          setFriendMealLogs([]);
          const message =
            mealLogsResult.reason instanceof ApiError
              ? mealLogsResult.reason.message
              : "Não foi possível carregar as refeições do amigo.";
          toast.error(message);
        }
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : "Não foi possível carregar a comparação.";
        toast.error(message);
        setComparison(null);
        setFriendMealLogs([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setMealLogsLoading(false);
      }
    },
    [friendUserId, dateParam],
  );

  useEffect(() => {
    void loadComparison(true);
  }, [loadComparison]);

  async function handleRemoveFriend() {
    if (!friend || removing) return;

    const confirmed = await messageService.confirmRemove({
      itemLabel: friend.name,
      title: "Remover amigo?",
      text: `Deseja remover ${friend.name} da sua lista de amigos?`,
    });

    if (!confirmed) return;

    setRemoving(true);
    try {
      await removeFriend(friendUserId);
      toast.success("Amigo removido.");
      router.push("/friends");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Não foi possível remover o amigo.";
      toast.error(message);
    } finally {
      setRemoving(false);
    }
  }

  if (loading) {
    return <DailyComparisonSkeleton />;
  }

  if (!comparison || !friend) {
    return (
      <PageScaffold
        title="Comparação"
        subtitle="Progresso diário"
        breadcrumbs={[
          { label: "Amigos", href: "/friends" },
          { label: "Comparação" },
        ]}
      >
        <Alert variant="destructive" title="Não conseguimos carregar a comparação">
          Verifique sua conexão e tente novamente.
        </Alert>
        <Button
          type="button"
          variant="outline"
          onClick={() => void loadComparison(true)}
        >
          <RefreshCw className="size-4" />
          Tentar novamente
        </Button>
      </PageScaffold>
    );
  }

  return (
    <PageScaffold
      title={friend.name}
      subtitle="Comparação do dia"
      breadcrumbs={[
        { label: "Amigos", href: "/friends" },
        { label: friend.name },
      ]}
      action={
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => void loadComparison(false)}
            disabled={refreshing}
          >
            <RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => void handleRemoveFriend()}
            disabled={removing}
          >
            <UserMinus className="size-4" />
            Remover
          </Button>
        </div>
      }
    >
      <MealsDatePicker
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <FriendDaySnapshotCard snapshot={comparison.me} label="Eu" />
        <FriendDaySnapshotCard
          snapshot={comparison.friend}
          label={comparison.friend.name}
        />
      </div>

      <FriendMealLogsSection
        friendName={friend.name}
        logs={friendMealLogs}
        loading={mealLogsLoading}
      />
    </PageScaffold>
  );
}
