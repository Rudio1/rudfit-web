const STORAGE_KEY = "rudfit_pending_invite_path";

export function savePendingInvitePath(path: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, path);
}

export function getPendingInviteRedirect(): string | null {
  if (typeof window === "undefined") return null;
  const path = sessionStorage.getItem(STORAGE_KEY);
  if (!path) return null;
  sessionStorage.removeItem(STORAGE_KEY);
  return path;
}

export function peekPendingInviteRedirect(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(STORAGE_KEY);
}
