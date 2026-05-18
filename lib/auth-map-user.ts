import type { AuthUser, UserRole } from "@/lib/auth-types";

export type BackendUserDto = {
  _id?: unknown;
  id?: unknown;
  name?: string | null;
  email: string;
  role?: string;
  emailVerified?: boolean;
};

export function mapBackendUserToAuthUser(u: BackendUserDto): AuthUser {
  const idRaw = u._id ?? u.id;
  const id = idRaw != null ? String(idRaw) : "";
  const email = u.email.trim().toLowerCase();
  const name = u.name?.trim();
  const backendRole = u.role ?? "user";
  const role: UserRole =
    backendRole === "super_admin" ? "super_admin" : backendRole === "user" ? "user" : (backendRole as UserRole);

  return {
    id,
    email,
    fullName: name && name.length > 0 ? name : email.split("@")[0] ?? email,
    role,
    emailVerified: !!u.emailVerified,
  };
}
