export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  username: string;
  profileImageUrl: string | null;
  isActive: boolean;
  age: number;
  weight: number;
  height: number;
  gender: number;
  goal: number;
  activityLevel: number;
  dailyRoutineLevel: number;
  goalIntensity: number;
  startingWeight: number;
  targetWeight: number;
  dailyCaloriesGoal: number;
  dailyProteinGoal: number;
  dailyCarbsGoal: number;
  dailyFatGoal: number;
}
