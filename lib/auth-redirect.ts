const AUTH_ONLY_PATHS = [
  "/login",
  "/signup",
  "/verify-email",
  "/otp",
  "/forgot-password",
  "/reset-password",
  "/welcome",
];

/** Safe internal path to return to after login (blocks open redirects). */
export function safeReturnPath(raw: string | null | undefined, fallback = "/"): string {
  if (!raw) return fallback;
  let path: string;
  try {
    path = decodeURIComponent(raw);
  } catch {
    return fallback;
  }
  if (!path.startsWith("/") || path.startsWith("//")) return fallback;

  const pathname = path.split("?")[0] ?? path;
  if (AUTH_ONLY_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return fallback;
  }
  return path;
}

function currentPath(): string {
  if (typeof window === "undefined") return "/";
  return `${window.location.pathname}${window.location.search}`;
}

export function loginHref(returnTo?: string, options?: { verified?: boolean }): string {
  const target = returnTo ?? currentPath();
  const params = new URLSearchParams();
  if (target && target !== "/") params.set("from", target);
  if (options?.verified) params.set("verified", "1");
  const q = params.toString();
  return q ? `/login?${q}` : "/login";
}

export function signupHref(returnTo?: string): string {
  const target = returnTo ?? currentPath();
  return `/signup?from=${encodeURIComponent(target)}`;
}

export function readReturnPathFromSearch(params: URLSearchParams): string | null {
  return params.get("from") ?? params.get("callbackUrl");
}
