import type { AuthSession } from "@/lib/types/auth";
import {
  AUTH_COOKIE,
  getCookieMaxAge,
  parseSession,
  serializeSession,
  STORAGE_KEY,
} from "@/lib/auth/session-shared";

function writeCookie(session: AuthSession): void {
  const maxAge = getCookieMaxAge(session.expiresAtUtc);
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";
  document.cookie = `${AUTH_COOKIE}=${encodeURIComponent(serializeSession(session))}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

function clearCookie(): void {
  document.cookie = `${AUTH_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  return parseSession(localStorage.getItem(STORAGE_KEY));
}

export function setSession(session: AuthSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, serializeSession(session));
  writeCookie(session);
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  clearCookie();
}

export function getAccessToken(): string | null {
  return getSession()?.accessToken ?? null;
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}

export function markFirstAccessComplete(): void {
  const session = getSession();
  if (!session) return;
  setSession({ ...session, isFirstAccess: false });
}
