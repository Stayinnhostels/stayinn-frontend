const DEFAULT_API = "http://localhost:3000";

export function getApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || DEFAULT_API;
  return url.replace(/\/$/, "");
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const data = (await res.json().catch(() => ({}))) as T & { message?: string; success?: boolean };

  if (!res.ok) {
    const msg = typeof data.message === "string" ? data.message : `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}
