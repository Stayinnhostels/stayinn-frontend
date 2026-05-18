"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Mail, XCircle } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { postVerifyEmail } from "@/lib/api/auth";
import { loginHref, readReturnPathFromSearch, safeReturnPath } from "@/lib/auth-redirect";
import { setPendingReturnPath } from "@/lib/auth-session";

const MIN_VERIFY_MS = 3000;

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { pendingSignupEmail, resendVerificationEmail } = useAuth();
  const [cooldown, setCooldown] = useState(0);
  const [verifyState, setVerifyState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const verifiedRef = useRef(false);

  const token = searchParams.get("token");
  const returnTo = useMemo(
    () => safeReturnPath(readReturnPathFromSearch(searchParams)),
    [searchParams],
  );

  const email = pendingSignupEmail;

  useEffect(() => {
    if (returnTo && returnTo !== "/") {
      setPendingReturnPath(returnTo);
    }
  }, [returnTo]);

  useEffect(() => {
    if (!token || verifiedRef.current) return;
    verifiedRef.current = true;

    const run = async () => {
      setVerifyState("loading");
      const started = Date.now();
      try {
        await postVerifyEmail(token);
        const remaining = MIN_VERIFY_MS - (Date.now() - started);
        if (remaining > 0) await delay(remaining);
        setVerifyState("success");
        toast.success("Email verified! Sign in to continue.");
        await delay(600);
        router.replace(loginHref(returnTo, { verified: true }));
      } catch (e) {
        const remaining = MIN_VERIFY_MS - (Date.now() - started);
        if (remaining > 0) await delay(remaining);
        const msg = e instanceof Error ? e.message : "Verification failed";
        setVerifyState("error");
        setVerifyError(msg);
        toast.error(msg);
      }
    };

    void run();
  }, [token, returnTo, router]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0) return;
    try {
      await resendVerificationEmail(returnTo);
      toast.success("Verification email sent");
      setCooldown(45);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not resend email");
    }
  };

  if (token) {
    if (verifyState === "loading" || verifyState === "idle") {
      return (
        <AuthLayout title="Verifying your email" subtitle="Please wait a moment…">
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Confirming your account…</p>
            <p className="text-xs text-muted-foreground/80">This usually takes a few seconds.</p>
          </div>
        </AuthLayout>
      );
    }

    if (verifyState === "success") {
      return (
        <AuthLayout title="Email verified" subtitle="Redirecting you to sign in…">
          <div className="flex flex-col items-center gap-4 py-8">
            <CheckCircle2 className="h-12 w-12 text-primary" />
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </AuthLayout>
      );
    }

    return (
      <AuthLayout
        title="Verification failed"
        subtitle={verifyError ?? "This link is invalid or has expired."}
        footer={
          <Link href={loginHref(returnTo)} className="font-bold text-primary hover:underline">
            Back to sign in
          </Link>
        }
      >
        <div className="flex flex-col items-center gap-4 py-4">
          <XCircle className="h-12 w-12 text-destructive" />
          <Button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || !email}
            variant="outline"
            className="w-full rounded-full font-bold"
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Send a new verification email"}
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={
        email
          ? `We sent a verification link to ${email}. Open it to activate your account.`
          : "Check your inbox for a verification link, or sign up again."
      }
      footer={
        <Link href={loginHref(returnTo)} className="font-bold text-primary hover:underline">
          Back to sign in
        </Link>
      }
    >
      <div className="space-y-5 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[image:var(--gradient-hero)] text-primary-foreground">
          <Mail className="h-10 w-10" />
        </div>
        <p className="text-sm text-muted-foreground">
          Click the link in your email. After verification you&apos;ll return to sign in, then to the page you were on.
        </p>
        <Button
          type="button"
          onClick={() => router.push(loginHref(returnTo))}
          size="lg"
          className="w-full rounded-full font-bold shadow-[var(--shadow-soft)]"
        >
          Go to sign in
        </Button>
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0 || !email}
          className="text-sm text-muted-foreground disabled:opacity-50 hover:text-primary"
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Didn't get it? Resend email"}
        </button>
      </div>
    </AuthLayout>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
