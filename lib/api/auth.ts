import { apiFetch } from "@/lib/api/client";
import { mapBackendUserToAuthUser, type BackendUserDto } from "@/lib/auth-map-user";
import type { AuthUser } from "@/lib/auth-types";

type LoginResponse = {
  success: boolean;
  message?: string;
  token: string;
  refreshToken: string;
  user: BackendUserDto;
};

type SignupResponse = {
  success: boolean;
  message?: string;
  user: BackendUserDto;
};

export async function postLogin(
  email: string,
  password: string,
): Promise<{ user: AuthUser; token: string; refreshToken: string }> {
  const data = await apiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    skipAuthRefresh: true,
  });
  if (!data.success || !data.token || !data.refreshToken || !data.user) {
    throw new Error(data.message ?? "Invalid response from server");
  }
  return {
    user: mapBackendUserToAuthUser(data.user),
    token: data.token,
    refreshToken: data.refreshToken,
  };
}

export async function postSignup(input: {
  name: string;
  email: string;
  password: string;
  from?: string;
}): Promise<{ user: AuthUser; message?: string }> {
  const body: Record<string, string> = {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    password: input.password,
  };
  if (input.from) body.from = input.from;

  const data = await apiFetch<SignupResponse>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(body),
    skipAuthRefresh: true,
  });
  if (!data.success || !data.user) {
    throw new Error(data.message ?? "Signup failed");
  }
  return { user: mapBackendUserToAuthUser(data.user), message: data.message };
}

export async function postLogout(token: string | null | undefined, refreshToken?: string | null): Promise<void> {
  await apiFetch("/api/auth/logout", {
    method: "POST",
    token: token ?? undefined,
    body: JSON.stringify(refreshToken ? { refreshToken } : {}),
    skipAuthRefresh: true,
  });
}

export async function postResendVerification(email: string, from?: string): Promise<void> {
  const body: Record<string, string> = { email: email.trim().toLowerCase() };
  if (from) body.from = from;

  await apiFetch("/api/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify(body),
    skipAuthRefresh: true,
  });
}

export async function postVerifyEmail(token: string): Promise<void> {
  const data = await apiFetch<{ success: boolean; message?: string }>("/api/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ token }),
    skipAuthRefresh: true,
  });
  if (!data.success) {
    throw new Error(data.message ?? "Verification failed");
  }
}

export async function postForgotPassword(email: string): Promise<void> {
  await apiFetch("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email: email.trim().toLowerCase() }),
    skipAuthRefresh: true,
  });
}

export async function postResetPassword(token: string, password: string): Promise<void> {
  await apiFetch("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
    skipAuthRefresh: true,
  });
}

export async function postSetPassword(
  token: string,
  password: string,
): Promise<{ user: AuthUser; token: string; refreshToken: string }> {
  const data = await apiFetch<LoginResponse>("/api/auth/set-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
    skipAuthRefresh: true,
  });
  if (!data.success || !data.token || !data.refreshToken || !data.user) {
    throw new Error(data.message ?? "Could not create password");
  }
  return {
    user: mapBackendUserToAuthUser(data.user),
    token: data.token,
    refreshToken: data.refreshToken,
  };
}
