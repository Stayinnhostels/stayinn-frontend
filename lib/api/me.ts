import { apiFetch } from "@/lib/api/client";
import { mapBackendUserToAuthUser, type BackendUserDto } from "@/lib/auth-map-user";
import type { AuthUser } from "@/lib/auth-types";

type MeResponse = {
  success: boolean;
  message?: string;
  user: BackendUserDto;
};

export async function patchMe(
  token: string,
  body: { name?: string },
): Promise<{ user: AuthUser; message?: string }> {
  const data = await apiFetch<MeResponse>("/api/auth/me", {
    method: "PATCH",
    token,
    body: JSON.stringify(body),
  });
  if (!data.success || !data.user) {
    throw new Error(data.message ?? "Could not update profile");
  }
  return { user: mapBackendUserToAuthUser(data.user), message: data.message };
}
