import { appEnv } from "@/lib/config/env";

export function getApiBaseUrl(): string {
  return appEnv.apiBaseUrl;
}

type ApiJson = Record<string, unknown>;

type ApiFetchInit = RequestInit & {
  token?: string | null;
  skipAuthRefresh?: boolean;
};

let refreshInFlight: Promise<string | null> | null = null;

async function refreshFrontendSession(): Promise<string | null> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    if (typeof window === "undefined") return null;
    const { loadSession, saveSession, sessionRemembered } = await import("@/lib/auth-session");
    const session = loadSession();
    if (!session?.refreshToken) return null;

    try {
      const res = await fetch(`${getApiBaseUrl()}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: session.refreshToken }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        token?: string;
        refreshToken?: string;
        user?: unknown;
        message?: string;
      };
      if (!res.ok || !data.success || !data.token || !data.refreshToken) {
        saveSession(null, true);
        return null;
      }

      const { mapBackendUserToAuthUser } = await import("@/lib/auth-map-user");
      const user = mapBackendUserToAuthUser(data.user as Parameters<typeof mapBackendUserToAuthUser>[0]);
      saveSession(
        { user, token: data.token, refreshToken: data.refreshToken },
        sessionRemembered(),
      );
      window.dispatchEvent(
        new CustomEvent("stayinn:session-refreshed", {
          detail: { token: data.token, refreshToken: data.refreshToken, user },
        }),
      );
      return data.token;
    } catch {
      saveSession(null, true);
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

export async function apiFetch<T = ApiJson>(path: string, init?: ApiFetchInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> | undefined),
  };
  if (init?.token) {
    headers.Authorization = `Bearer ${init.token}`;
  }

  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers,
  });

  if (res.status === 401 && !init?.skipAuthRefresh && path !== "/api/auth/refresh") {
    const nextToken = await refreshFrontendSession();
    if (nextToken) {
      return apiFetch<T>(path, { ...init, token: nextToken, skipAuthRefresh: true });
    }
  }

  const data = (await res.json().catch(() => ({}))) as T & { message?: string; success?: boolean };

  if (!res.ok) {
    const msg = typeof data.message === "string" ? data.message : `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}
