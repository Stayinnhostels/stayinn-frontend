"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Lock, ShieldCheck } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AUTH_FIELD, AUTH_ICON, AUTH_LABEL, AUTH_SUBMIT } from "@/components/auth/auth-field";
import { PasswordStrength, getPasswordScore } from "@/components/auth/password-strength";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";

const schema = z
  .object({
    password: z.string().min(8, "At least 8 characters").max(72),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type FormValues = z.infer<typeof schema>;

function SetPasswordForm() {
  const { completePasswordSetup } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { password: "", confirmPassword: "" } });
  const pw = watch("password");

  if (!token || !/^[a-f0-9]{64}$/i.test(token)) {
    return (
      <AuthLayout
        title="Invalid invite link"
        subtitle="Use the link from your booking email. If it expired, contact the hostel and ask them to send a new one."
        footer={
          <Link href="/login" className="font-bold text-primary hover:underline">
            Back to sign in
          </Link>
        }
      >
        <Button asChild className="w-full rounded-full font-bold h-11">
          <Link href="/contact">Contact us</Link>
        </Button>
      </AuthLayout>
    );
  }

  const onSubmit = async ({ password }: FormValues) => {
    if (getPasswordScore(password) < 2) {
      toast.error("Please choose a stronger password");
      return;
    }
    try {
      await completePasswordSetup(token, password);
      toast.success("Password created — you are signed in");
      router.replace("/account/bookings");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not create password");
    }
  };

  return (
    <AuthLayout
      title="Create your password"
      subtitle="Set a password to track your stay, payments, and booking details on the website."
      footer={
        <Link href="/login" className="font-bold text-primary hover:underline">
          Already have a password? Sign in
        </Link>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="password" className={AUTH_LABEL}>
            Password
          </Label>
          <div className="relative">
            <Lock className={AUTH_ICON} />
            <Input
              id="password"
              type={showPw ? "text" : "password"}
              placeholder="At least 8 characters"
              className={`${AUTH_FIELD} pl-10 pr-10`}
              autoComplete="new-password"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Toggle password"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <PasswordStrength password={pw} />
          {errors.password && <p className="text-xs text-destructive font-medium">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className={AUTH_LABEL}>
            Confirm password
          </Label>
          <Input
            id="confirmPassword"
            type={showPw ? "text" : "password"}
            placeholder="Repeat password"
            className={AUTH_FIELD}
            autoComplete="new-password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-destructive font-medium">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="flex items-start gap-2 rounded-2xl border border-border/60 bg-muted/40 p-3.5 text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          After you create this password you will be signed in automatically and can track your stay.
        </div>

        <Button type="submit" disabled={isSubmitting} size="lg" className={AUTH_SUBMIT}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Creating…
            </>
          ) : (
            "Create password and continue"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <SetPasswordForm />
    </Suspense>
  );
}
