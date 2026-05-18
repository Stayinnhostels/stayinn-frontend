"use client";

import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

/** Backend verifies email via magic link, not a 6-digit OTP. */
export default function OtpPage() {
  return (
    <AuthLayout
      title="Check your email"
      subtitle="We send a verification link to your inbox — not a numeric code."
      footer={
        <Link href="/login" className="font-bold text-primary hover:underline">
          Back to sign in
        </Link>
      }
    >
      <div className="space-y-5 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-10 w-10 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground">
          Open the link in the email to verify your account, then sign in.
        </p>
        <Button asChild size="lg" className="w-full rounded-full font-bold shadow-[var(--shadow-soft)]">
          <Link href="/verify-email">Back to verification help</Link>
        </Button>
      </div>
    </AuthLayout>
  );
}
