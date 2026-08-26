"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Suspense, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AUTH_FIELD, AUTH_ICON, AUTH_LABEL, AUTH_SUBMIT } from "@/components/auth/auth-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth-context";
import { readReturnPathFromSearch, safeReturnPath, signupHref } from "@/lib/auth-redirect";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(120),
  password: z.string().min(1, "Password is required").max(200),
  remember: z.boolean().optional(),
});
type FormValues = z.infer<typeof schema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, login } = useAuth();
  const [showPw, setShowPw] = useState(false);

  const returnTo = useMemo(
    () => safeReturnPath(readReturnPathFromSearch(searchParams), "/account"),
    [searchParams],
  );

  useEffect(() => {
    if (searchParams.get("verified") === "1") {
      toast.success("Email verified! You can sign in now.");
    }
  }, [searchParams]);

  useEffect(() => {
    if (!loading && user) {
      router.replace(returnTo);
    }
  }, [loading, user, returnTo, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", remember: true },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await login(values.email, values.password, values.remember);
      toast.success("Welcome back!");
      router.replace(returnTo);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Sign in failed";
      toast.error(msg);
      if (msg.toLowerCase().includes("verify")) {
        router.push("/verify-email");
      }
    }
  };

  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to book seats and manage your stays."
      footer={
        <>
          New here?{" "}
          <Link href={signupHref(returnTo)} className="font-bold text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className={AUTH_LABEL}>
            Email
          </Label>
          <div className="relative">
            <Mail className={AUTH_ICON} />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@email.com"
              className={`${AUTH_FIELD} pl-10`}
              aria-invalid={!!errors.email}
              {...register("email")}
            />
          </div>
          {errors.email && <p className="text-xs text-destructive font-medium">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className={AUTH_LABEL}>
              Password
            </Label>
            <Link href="/forgot-password" className="text-xs font-bold text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className={AUTH_ICON} />
            <Input
              id="password"
              type={showPw ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className={`${AUTH_FIELD} pl-10 pr-10`}
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-destructive font-medium">{errors.password.message}</p>}
        </div>

        <label className="flex cursor-pointer select-none items-center gap-2 text-sm">
          <Checkbox {...register("remember")} defaultChecked />
          <span className="text-muted-foreground">Remember me for 30 days</span>
        </label>

        <Button type="submit" disabled={isSubmitting} size="lg" className={AUTH_SUBMIT}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
