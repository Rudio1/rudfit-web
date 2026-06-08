export interface FriendInviteLink {
  token: string;
  url: string;
  isActive: boolean;
}

export interface PatchInviteLinkRequest {
  isActive: boolean;
}

export interface InvitePreview {
  userId: string;
  name: string;
  username: string | null;
  profileImageUrl: string | null;
}

export interface Friendship {
  friendshipId: string;
  friendUserId: string;
  name: string;
  username: string | null;
  profileImageUrl: string | null;
  establishedAt: string;
}

export interface FriendDailyGoals {
  dailyCaloriesGoal: number;
  dailyProteinGoal: number;
  dailyCarbsGoal: number;
  dailyFatGoal: number;
}

export interface FriendDailyConsumption {
  date: string;
  mealsCount: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface FriendDailyProgress {
  caloriesPercent: number;
  proteinPercent: number;
  carbsPercent: number;
  fatPercent: number;
}

export interface FriendDaySnapshot {
  userId: string;
  name: string;
  profileImageUrl: string | null;
  goals: FriendDailyGoals;
  consumption: FriendDailyConsumption;
  progress: FriendDailyProgress;
}

export interface DailyComparisonResponse {
  date: string;
  me: FriendDaySnapshot;
  friend: FriendDaySnapshot;
}
