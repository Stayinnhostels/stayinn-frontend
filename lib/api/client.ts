import { appEnv } from "@/lib/config/env";

export function getApiBaseUrl(): string {
  return appEnv.apiBaseUrl;
}

type ApiJson = Record<string, unknown>;

export async function apiFetch<T = ApiJson>(
  path: string,
  init?: RequestInit & { token?: string | null },
): Promise<T> {
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

  const data = (await res.json().catch(() => ({}))) as T & { message?: string; success?: boolean };

  if (!res.ok) {
    const msg = typeof data.message === "string" ? data.message : `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}
