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
import { getSession } from "@/lib/auth/session";
import { getFirstName } from "@/lib/meals/progress";
import type { UserProfile } from "@/lib/types/profile";

interface ProfileContextValue {
  profile: UserProfile | null;
  displayName: string;
  loading: boolean;
  refresh: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getProfileMe();
      setProfile(result);
    } catch {
      setProfile(null);
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

  const value = useMemo(
    () => ({
      profile,
      displayName,
      loading,
      refresh,
    }),
    [profile, displayName, loading, refresh],
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
