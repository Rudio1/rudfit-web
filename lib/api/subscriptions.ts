import { api } from "@/lib/api/client";
import type { UserSubscription } from "@/lib/types/subscriptions";

export async function getSubscriptionMe(): Promise<UserSubscription> {
  return api<UserSubscription>("/subscriptions/me");
}
