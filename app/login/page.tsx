"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { SocialButtons, OrDivider } from "@/components/auth/social-buttons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth-context";
import { dashboardHref } from "@/lib/app-links";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(120),
  password: z.string().min(6, "At least 6 characters").max(72),
  remember: z.boolean().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPw, setShowPw] = useState(false);

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
      router.push(dashboardHref());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Sign in failed");
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue managing your seat and stays."
      footer={
        <>
          New here?{" "}
          <Link href="/signup" className="font-bold text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <SocialButtons />
      <OrDivider />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="font-semibold">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@email.com"
              className="pl-10 h-11 rounded-full"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
          </div>
          {errors.email && <p className="text-xs text-destructive font-medium">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="font-semibold">
              Password
            </Label>
            <Link href="/forgot-password" className="text-xs font-bold text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPw ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className="pl-10 pr-10 h-11 rounded-full"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-destructive font-medium">{errors.password.message}</p>}
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <Checkbox {...register("remember")} defaultChecked />
          <span className="text-muted-foreground">Remember me for 30 days</span>
        </label>

        <Button type="submit" disabled={isSubmitting} size="lg" className="w-full rounded-full font-bold shadow-[var(--shadow-soft)]">
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
