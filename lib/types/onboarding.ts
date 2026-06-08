export enum GoalType {
  LoseWeight = 1,
  GainMuscle = 2,
  MaintainWeight = 3,
  BodyRecomposition = 4,
}

export enum GenderType {
  Male = 1,
  Female = 2,
  Other = 3,
}

export enum ActivityLevelType {
  Sedentary = 1,
  LightlyActive = 2,
  ModeratelyActive = 3,
  VeryActive = 4,
  Athlete = 5,
}

export interface CompleteOnboardingRequest {
  goal: GoalType;
  gender: GenderType;
  age: number;
  height: number;
  weight: number;
  startingWeight: number;
  targetWeight: number;
  activityLevel: ActivityLevelType;
  dailyRoutineLevel: number;
  goalIntensity: number;
}

export interface CompleteOnboardingResponse {
  completed: boolean;
  isFirstAccess: boolean;
}

export interface DailyGoalsResponse {
  dailyCaloriesGoal: number;
  dailyProteinGoal: number;
  dailyCarbsGoal: number;
  dailyFatGoal: number;
}

export interface OnboardingFormState {
  goal: GoalType | null;
  gender: GenderType | null;
  age: string;
  height: string;
  weight: string;
  targetWeight: string;
  dailyRoutineLevel: number | null;
  activityLevel: ActivityLevelType | null;
  goalIntensity: number | null;
}

export const INITIAL_ONBOARDING_STATE: OnboardingFormState = {
  goal: null,
  gender: null,
  age: "",
  height: "",
  weight: "",
  targetWeight: "",
  dailyRoutineLevel: null,
  activityLevel: null,
  goalIntensity: null,
};
