import type { CompleteOnboardingRequest } from "@/lib/types/onboarding";
import {
  ActivityLevelType,
  GenderType,
  GoalType,
} from "@/lib/types/onboarding";
import type { UserProfile } from "@/lib/types/profile";

export function profileToOnboardingFormState(profile: UserProfile) {
  const heightMeters = profile.height / 100;

  return {
    goal: profile.goal as GoalType,
    gender: profile.gender as GenderType,
    age: String(profile.age),
    height: heightMeters.toFixed(2).replace(".", ","),
    weight: String(profile.weight),
    targetWeight: String(profile.targetWeight),
    dailyRoutineLevel: profile.dailyRoutineLevel,
    activityLevel: profile.activityLevel as ActivityLevelType,
    goalIntensity: profile.goalIntensity,
  };
}

export function profileToOnboardingRequest(
  profile: UserProfile,
  overrides?: Partial<CompleteOnboardingRequest>,
): CompleteOnboardingRequest {
  return {
    goal: profile.goal as GoalType,
    gender: profile.gender as GenderType,
    age: profile.age,
    height: profile.height,
    weight: profile.weight,
    startingWeight: profile.startingWeight,
    targetWeight: profile.targetWeight,
    activityLevel: profile.activityLevel as ActivityLevelType,
    dailyRoutineLevel: profile.dailyRoutineLevel,
    goalIntensity: profile.goalIntensity,
    ...overrides,
  };
}

export function formStateToOnboardingRequest(
  form: {
    goal: GoalType;
    gender: GenderType;
    age: string;
    height: string;
    weight: string;
    targetWeight: string;
    activityLevel: ActivityLevelType;
    dailyRoutineLevel: number;
    goalIntensity: number;
  },
  startingWeight: number,
): CompleteOnboardingRequest {
  return {
    goal: form.goal,
    gender: form.gender,
    age: Number(form.age),
    height: Math.round(Number(form.height.replace(",", ".")) * 100),
    weight: Math.round(Number(form.weight.replace(",", "."))),
    startingWeight,
    targetWeight: Math.round(Number(form.targetWeight.replace(",", "."))),
    activityLevel: form.activityLevel,
    dailyRoutineLevel: form.dailyRoutineLevel,
    goalIntensity: form.goalIntensity,
  };
}
