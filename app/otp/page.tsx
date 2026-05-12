"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

const LENGTH = 6;

export default function OtpPage() {
  const { verifyEmail, resendOtp } = useAuth();
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(""));
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(45);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const code = digits.join("");

  const setAt = (i: number, val: string) => {
    const next = [...digits];
    next[i] = val;
    setDigits(next);
  };

  const handleChange = (i: number, val: string) => {
    const v = val.replace(/\D/g, "").slice(-1);
    setAt(i, v);
    if (v && i < LENGTH - 1) refs.current[i + 1]?.focus();
  };

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < LENGTH - 1) refs.current[i + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
    if (!text) return;
    e.preventDefault();
    const next = Array(LENGTH).fill("");
    text.split("").forEach((c, i) => {
      next[i] = c;
    });
    setDigits(next);
    refs.current[Math.min(text.length, LENGTH - 1)]?.focus();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== LENGTH) {
      toast.error("Enter all 6 digits");
      return;
    }
    setSubmitting(true);
    try {
      await verifyEmail(code);
      toast.success("Verified!");
      router.push("/welcome");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    await resendOtp();
    toast.success("New code sent");
    setCooldown(45);
  };

  return (
    <AuthLayout
      title="Enter verification code"
      subtitle="We sent a 6-digit code to your email."
      footer={
        <Link href="/login" className="font-bold text-primary hover:underline">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="flex justify-between gap-2" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKey(i, e)}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              aria-label={`Digit ${i + 1}`}
              className="h-14 w-full text-center text-2xl font-extrabold rounded-2xl border-2 border-input bg-background focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 transition"
            />
          ))}
        </div>

        <Button type="submit" disabled={submitting || code.length !== LENGTH} size="lg" className="w-full rounded-full font-bold shadow-[var(--shadow-soft)]">
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Verifying…
            </>
          ) : (
            "Verify"
          )}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Didn&apos;t get the code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0}
            className="font-bold text-primary hover:underline disabled:opacity-50 disabled:no-underline"
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend"}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
