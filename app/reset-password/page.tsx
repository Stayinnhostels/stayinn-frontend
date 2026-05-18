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

function ResetPasswordForm() {
  const { resetPassword } = useAuth();
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
        title="Invalid reset link"
        subtitle="Use the link from your email, or request a new one."
        footer={
          <Link href="/forgot-password" className="font-bold text-primary hover:underline">
            Request new link
          </Link>
        }
      >
        <Button asChild className="w-full rounded-full font-bold h-11">
          <Link href="/forgot-password">Forgot password</Link>
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
      await resetPassword(token, password);
      toast.success("Password updated!");
      router.push("/login");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not reset password");
    }
  };

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Choose a strong password you don't use elsewhere."
      footer={
        <Link href="/login" className="font-bold text-primary hover:underline">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="password" className="font-semibold">
            New password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPw ? "text" : "password"}
              placeholder="At least 8 characters"
              className="pl-10 pr-10 h-11 rounded-full"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Toggle password"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <PasswordStrength password={pw} />
          {errors.password && <p className="text-xs text-destructive font-medium">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="font-semibold">
            Confirm password
          </Label>
          <Input
            id="confirmPassword"
            type={showPw ? "text" : "password"}
            placeholder="Repeat password"
            className="h-11 rounded-full"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-destructive font-medium">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="rounded-xl bg-muted/40 p-3 flex items-start gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          Use a mix of upper & lower case letters, numbers, and a symbol for the strongest result.
        </div>

        <Button type="submit" disabled={isSubmitting} size="lg" className="w-full rounded-full font-bold shadow-[var(--shadow-soft)]">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Updating…
            </>
          ) : (
            "Reset password"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
