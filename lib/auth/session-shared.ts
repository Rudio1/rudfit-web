import type { AuthSession } from "@/lib/types/auth";

export const AUTH_COOKIE = "rudfit_auth";
export const STORAGE_KEY = "rudfit_auth";

export function parseSession(raw: string | null | undefined): AuthSession | null {
  if (!raw) return null;

  try {
    const session = JSON.parse(raw) as AuthSession;
    if (!session.accessToken || !session.expiresAtUtc) return null;

    if (new Date(session.expiresAtUtc).getTime() <= Date.now()) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function serializeSession(session: AuthSession): string {
  return JSON.stringify(session);
}

export function getCookieMaxAge(expiresAtUtc: string): number {
  const seconds = Math.floor(
    (new Date(expiresAtUtc).getTime() - Date.now()) / 1000,
  );
  return Math.max(seconds, 0);
}
