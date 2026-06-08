"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import { listFriends } from "@/lib/api/friendships";
import { ApiError } from "@/lib/api/errors";
import type { Friendship } from "@/lib/types/friendships";
import { FriendCard } from "@/components/friends/friend-card";
import { FriendsListSkeleton } from "@/components/friends/friends-list-skeleton";
import { PageScaffold } from "@/components/layout/page-scaffold";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

function sortFriends(friends: Friendship[]): Friendship[] {
  return [...friends].sort(
    (a, b) =>
      new Date(b.establishedAt).getTime() - new Date(a.establishedAt).getTime(),
  );
}

export function FriendsList() {
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFriends() {
      try {
        const data = await listFriends();
        setFriends(sortFriends(data));
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : "Não foi possível carregar seus amigos.";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }

    void loadFriends();
  }, []);

  if (loading) {
    return <FriendsListSkeleton />;
  }

  return (
    <PageScaffold
      title="Amigos"
      subtitle="Acompanhe o progresso diário com quem treina com você"
      breadcrumbs={[{ label: "Início", href: "/" }, { label: "Amigos" }]}
      action={
        <Link
          href="/friends/invite"
          className={cn(buttonVariants({ size: "lg" }), "shadow-sm")}
        >
          <UserPlus className="size-4" />
          Convidar
        </Link>
      }
    >
      {friends.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Nenhum amigo ainda"
          description="Convide alguém para acompanhar metas e progresso do dia juntos."
          action={
            <Link
              href="/friends/invite"
              className={cn(buttonVariants({ size: "lg" }), "shadow-sm")}
            >
              <UserPlus className="size-4" />
              Convidar amigo
            </Link>
          }
        />
      ) : (
        <div className="grid gap-3">
          {friends.map((friend) => (
            <FriendCard key={friend.friendshipId} friend={friend} />
          ))}
        </div>
      )}
    </PageScaffold>
  );
}
