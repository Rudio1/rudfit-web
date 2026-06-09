export interface UserSubscription {
  hasPremium: boolean;
  status: string;
  planCode: string | null;
  planName: string | null;
  currentPeriodEnd: string | null;
  billingType: string | null;
  freeScannerUsesCount: number | null;
  freeScannerUsesRemaining: number | null;
}
