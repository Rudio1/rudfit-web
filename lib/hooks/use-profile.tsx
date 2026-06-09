"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProfileMe } from "@/lib/api/profile";
import { getSubscriptionMe } from "@/lib/api/subscriptions";
import { getSession } from "@/lib/auth/session";
import { getFirstName } from "@/lib/meals/progress";
import type { UserProfile } from "@/lib/types/profile";
import type { UserSubscription } from "@/lib/types/subscriptions";

interface ProfileContextValue {
  profile: UserProfile | null;
  subscription: UserSubscription | null;
  hasPremium: boolean;
  displayName: string;
  loading: boolean;
  refresh: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [profileResult, subscriptionResult] = await Promise.allSettled([
        getProfileMe(),
        getSubscriptionMe(),
      ]);

      if (profileResult.status === "fulfilled") {
        setProfile(profileResult.value);
      } else {
        setProfile(null);
      }

      if (subscriptionResult.status === "fulfilled") {
        setSubscription(subscriptionResult.value);
      } else {
        setSubscription(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const displayName = useMemo(() => {
    if (profile?.name?.trim()) return getFirstName(profile.name);
    const username = getSession()?.username?.trim();
    if (username) return username;
    return "Usuário";
  }, [profile]);

  const hasPremium = subscription?.hasPremium ?? false;

  const value = useMemo(
    () => ({
      profile,
      subscription,
      hasPremium,
      displayName,
      loading,
      refresh,
    }),
    [profile, subscription, hasPremium, displayName, loading, refresh],
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContextValue {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within ProfileProvider");
  }
  return context;
}
