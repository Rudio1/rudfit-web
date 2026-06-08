import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Friendship } from "@/lib/types/friendships";
import { FriendAvatar } from "@/components/friends/friend-avatar";

interface FriendCardProps {
  friend: Friendship;
}

export function FriendCard({ friend }: FriendCardProps) {
  return (
    <Link
      href={`/friends/${friend.friendUserId}`}
      className="action-link surface-card flex items-center gap-4 p-4 transition-colors hover:bg-card-elevated/50"
    >
      <FriendAvatar
        name={friend.name}
        profileImageUrl={friend.profileImageUrl}
        size="md"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground">{friend.name}</p>
        {friend.username ? (
          <p className="truncate text-sm text-muted-foreground">
            @{friend.username}
          </p>
        ) : null}
      </div>
      <ChevronRight
        className="size-5 shrink-0 text-muted-foreground"
        aria-hidden
      />
    </Link>
  );
}
