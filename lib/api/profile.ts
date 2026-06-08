import { api } from "@/lib/api/client";
import type { CompleteOnboardingRequest, DailyGoalsResponse } from "@/lib/types/onboarding";
import type { UserProfile } from "@/lib/types/profile";

export async function getProfileMe(): Promise<UserProfile> {
  return api<UserProfile>("/profile/me");
}

export async function recalculateDailyGoals(
  request: CompleteOnboardingRequest,
): Promise<DailyGoalsResponse> {
  return api<DailyGoalsResponse>("/profile/me/recalculate-daily-goals", {
    method: "POST",
    body: JSON.stringify(request),
  });
}
