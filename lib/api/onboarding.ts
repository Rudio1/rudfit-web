import { api } from "@/lib/api/client";
import type {
  CompleteOnboardingRequest,
  CompleteOnboardingResponse,
  DailyGoalsResponse,
} from "@/lib/types/onboarding";

export async function completeOnboarding(
  request: CompleteOnboardingRequest,
): Promise<CompleteOnboardingResponse> {
  return api<CompleteOnboardingResponse>("/Onboarding", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function calculateDailyGoals(): Promise<DailyGoalsResponse> {
  return api<DailyGoalsResponse>("/Onboarding/calculate-daily-goals", {
    method: "POST",
  });
}

export async function getDailyGoals(): Promise<DailyGoalsResponse> {
  return api<DailyGoalsResponse>("/Onboarding/daily-goals");
}
