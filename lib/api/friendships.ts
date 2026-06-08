import { api } from "@/lib/api/client";
import type {
  DailyComparisonResponse,
  FriendInviteLink,
  Friendship,
  InvitePreview,
  PatchInviteLinkRequest,
} from "@/lib/types/friendships";
import type { MealLog } from "@/lib/types/meals";

export async function getInviteLink(): Promise<FriendInviteLink> {
  return api<FriendInviteLink>("/friendships/invite-link");
}

export async function regenerateInviteLink(): Promise<FriendInviteLink> {
  return api<FriendInviteLink>("/friendships/invite-link/regenerate", {
    method: "POST",
  });
}

export async function patchInviteLink(
  body: PatchInviteLinkRequest,
): Promise<FriendInviteLink> {
  return api<FriendInviteLink>("/friendships/invite-link", {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function getInvitePreview(token: string): Promise<InvitePreview> {
  return api<InvitePreview>(`/friendships/invites/${token}/preview`);
}

export async function acceptInvite(token: string): Promise<Friendship> {
  return api<Friendship>(`/friendships/invites/${token}/accept`, {
    method: "POST",
  });
}

export async function listFriends(): Promise<Friendship[]> {
  return api<Friendship[]>("/friendships");
}

export async function getFriend(friendUserId: string): Promise<Friendship> {
  return api<Friendship>(`/friendships/${friendUserId}`);
}

export async function removeFriend(friendUserId: string): Promise<void> {
  return api<void>(`/friendships/${friendUserId}`, {
    method: "DELETE",
  });
}

export async function getDailyComparison(
  friendUserId: string,
  date?: string,
): Promise<DailyComparisonResponse> {
  const query = date ? `?date=${encodeURIComponent(date)}` : "";
  return api<DailyComparisonResponse>(
    `/friendships/${friendUserId}/daily-comparison${query}`,
  );
}

export async function getFriendMealLogs(
  friendUserId: string,
  date: string,
): Promise<MealLog[]> {
  return api<MealLog[]>(
    `/friendships/${friendUserId}/meal-logs?date=${encodeURIComponent(date)}`,
  );
}
