"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Mail } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export default function VerifyEmailPage() {
  const { user, verifyEmail, resendOtp } = useAuth();
  const router = useRouter();
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(user?.emailVerified ?? false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleVerify = async () => {
    setVerifying(true);
    try {
      await verifyEmail();
      setVerified(true);
      toast.success("Email verified!");
    } catch {
      toast.error("Verification failed. Try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    await resendOtp();
    toast.success("Verification email sent");
    setCooldown(45);
  };

  if (verified) {
    return (
      <AuthLayout title="You're verified! 🎉" subtitle="Your email has been confirmed. You can now access everything.">
        <div className="space-y-5 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <Button type="button" onClick={() => router.push("/welcome")} size="lg" className="w-full rounded-full font-bold shadow-[var(--shadow-soft)]">
            Continue
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={user?.email ? `We sent a verification link to ${user.email}.` : "Check your inbox for a verification link."}
      footer={
        <Link href="/login" className="font-bold text-primary hover:underline">
          Back to sign in
        </Link>
      }
    >
      <div className="space-y-5 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[image:var(--gradient-hero)] text-primary-foreground">
          <Mail className="h-10 w-10" />
        </div>
        <p className="text-sm text-muted-foreground">
          Click the link in the email to activate your account. You can also enter a 6-digit code.
        </p>
        <div className="flex flex-col gap-3">
          <Button type="button" onClick={handleVerify} disabled={verifying} size="lg" className="w-full rounded-full font-bold shadow-[var(--shadow-soft)]">
            {verifying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Verifying…
              </>
            ) : (
              "I've verified my email"
            )}
          </Button>
          <Button asChild variant="outline" className="w-full rounded-full font-bold h-11">
            <Link href="/otp">Enter code instead</Link>
          </Button>
        </div>
        <button type="button" onClick={handleResend} disabled={cooldown > 0} className="text-sm text-muted-foreground disabled:opacity-50">
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Didn't get it? Resend email"}
        </button>
      </div>
    </AuthLayout>
  );
}
