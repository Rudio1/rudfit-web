import { api } from "@/lib/api/client";
import type { UserProfile } from "@/lib/types/profile";

export async function getProfileMe(): Promise<UserProfile> {
  return api<UserProfile>("/profile/me");
}
