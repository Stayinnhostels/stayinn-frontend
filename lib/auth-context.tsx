"use client";

import * as React from "react";
import {
  postForgotPassword,
  postLogin,
  postLogout,
  postResendVerification,
  postResetPassword,
  postSignup,
} from "@/lib/api/auth";
import {
  clearPendingReturnPath,
  clearPendingSignupEmail,
  getPendingReturnPath,
  getPendingSignupEmail,
  loadSession,
  saveSession,
  setPendingReturnPath,
  setPendingSignupEmail,
} from "@/lib/auth-session";
import { safeReturnPath } from "@/lib/auth-redirect";
import type { AuthUser } from "@/lib/auth-types";

export type { AuthUser, UserRole } from "@/lib/auth-types";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  isAdmin: boolean;
  pendingSignupEmail: string | null;
  login: (email: string, password: string, remember?: boolean) => Promise<AuthUser>;
  signup: (input: {
    fullName: string;
    email: string;
    password: string;
    role?: string;
    returnPath?: string;
  }) => Promise<AuthUser>;
  logout: () => Promise<void>;
  resendVerificationEmail: (returnPath?: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [token, setToken] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [pendingSignupEmail, setPendingEmail] = React.useState<string | null>(null);

  React.useEffect(() => {
    const session = loadSession();
    if (session) {
      setUser(session.user);
      setToken(session.token);
    }
    setPendingEmail(getPendingSignupEmail());
    setLoading(false);
  }, []);

  const logout = React.useCallback(async () => {
    const currentToken = token;
    try {
      if (currentToken) await postLogout(currentToken);
    } catch {
      // Clear local session even if revoke fails.
    }
    saveSession(null, true);
    setUser(null);
    setToken(null);
  }, [token]);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      isAdmin: user?.role === "super_admin",
      pendingSignupEmail,

      async login(email, password, remember = true) {
        const { user: nextUser, token: nextToken } = await postLogin(email, password);
        if (!nextUser.emailVerified && nextUser.role === "user") {
          setPendingSignupEmail(email);
          setPendingEmail(email.trim().toLowerCase());
          throw new Error(
            "Please verify your email before signing in. Check your inbox or request a new verification link.",
          );
        }
        clearPendingSignupEmail();
        setPendingEmail(null);
        setUser(nextUser);
        setToken(nextToken);
        saveSession({ user: nextUser, token: nextToken }, remember);
        return nextUser;
      },

      async signup({ fullName, email, password, returnPath }) {
        const from = safeReturnPath(returnPath);
        const { user: created } = await postSignup({
          name: fullName,
          email,
          password,
          from,
        });
        const normalizedEmail = email.trim().toLowerCase();
        setPendingSignupEmail(normalizedEmail);
        setPendingEmail(normalizedEmail);
        setPendingReturnPath(from);
        setUser(null);
        setToken(null);
        saveSession(null, true);
        return created;
      },

      logout,

      async resendVerificationEmail(returnPath) {
        const email = pendingSignupEmail ?? user?.email ?? getPendingSignupEmail();
        if (!email) {
          throw new Error("No email on file. Sign up again or sign in.");
        }
        const from = safeReturnPath(returnPath ?? getPendingReturnPath() ?? undefined);
        await postResendVerification(email, from);
      },

      async requestPasswordReset(email) {
        await postForgotPassword(email);
      },

      async resetPassword(resetToken, password) {
        await postResetPassword(resetToken, password);
      },
    }),
    [user, token, loading, logout, pendingSignupEmail],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");

  return {
    ...ctx,
    /** @deprecated Use resendVerificationEmail — backend sends email links, not OTP codes. */
    resendOtp: ctx.resendVerificationEmail,
    /** @deprecated Email is verified via the link in your inbox; then sign in. */
    verifyEmail: async () => {
      throw new Error("Open the verification link in your email, then sign in.");
    },
  };
}
