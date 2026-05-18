import type { AuthUser } from "@/lib/auth-types";
import {
  LEGACY_USER_KEY,
  PENDING_RETURN_PATH_KEY,
  PENDING_SIGNUP_EMAIL_KEY,
  SESSION_KEY,
} from "@/lib/auth-types";

export type StoredSession = { user: AuthUser; token: string };

export function loadSession(): StoredSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY) ?? sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoredSession;
    if (!parsed?.user || typeof parsed.token !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveSession(session: StoredSession | null, remember: boolean) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(LEGACY_USER_KEY);
  if (session) {
    const raw = JSON.stringify(session);
    if (remember) localStorage.setItem(SESSION_KEY, raw);
    else sessionStorage.setItem(SESSION_KEY, raw);
  }
}

export function getPendingSignupEmail(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(PENDING_SIGNUP_EMAIL_KEY);
}

export function setPendingSignupEmail(email: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PENDING_SIGNUP_EMAIL_KEY, email.trim().toLowerCase());
}

export function clearPendingSignupEmail() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(PENDING_SIGNUP_EMAIL_KEY);
}

export function getPendingReturnPath(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(PENDING_RETURN_PATH_KEY);
}

export function setPendingReturnPath(path: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PENDING_RETURN_PATH_KEY, path);
}

export function clearPendingReturnPath() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(PENDING_RETURN_PATH_KEY);
}
