export type UserRole = "super_admin" | "admin" | "user" | "guest";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
}

export const SESSION_KEY = "stayinn.frontend.session";
export const PENDING_SIGNUP_EMAIL_KEY = "stayinn.pendingSignupEmail";
export const PENDING_RETURN_PATH_KEY = "stayinn.pendingReturnPath";
export const LEGACY_USER_KEY = "stayinn.auth.user";
