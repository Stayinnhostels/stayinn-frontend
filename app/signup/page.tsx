"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Suspense, useMemo, useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Mail, Lock, User } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AUTH_FIELD, AUTH_ICON, AUTH_LABEL, AUTH_SUBMIT } from "@/components/auth/auth-field";
import { PasswordStrength, getPasswordScore } from "@/components/auth/password-strength";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { loginHref, readReturnPathFromSearch, safeReturnPath } from "@/lib/auth-redirect";

const schema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name").max(80),
    email: z.string().trim().email("Enter a valid email").max(120),
    password: z.string().min(8, "At least 8 characters").max(72),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signup } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const returnTo = useMemo(
    () => safeReturnPath(readReturnPathFromSearch(searchParams), "/account"),
    [searchParams],
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const pw = watch("password");

  const onSubmit = async (values: FormValues) => {
    if (getPasswordScore(values.password) < 2) {
      toast.error("Please choose a stronger password");
      return;
    }
    try {
      await signup({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        returnPath: returnTo,
      });
      toast.success("Account created! Check your email to verify your account.");
      const verifyParams = new URLSearchParams();
      if (returnTo && returnTo !== "/") verifyParams.set("from", returnTo);
      const q = verifyParams.toString();
      router.push(q ? `/verify-email?${q}` : "/verify-email");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Signup failed");
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join Stay Inn and book your seat in minutes."
      footer={
        <>
          Already a member?{" "}
          <Link href={loginHref(returnTo)} className="font-bold text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="fullName" className={AUTH_LABEL}>
            Full name
          </Label>
          <div className="relative">
            <User className={AUTH_ICON} />
            <Input id="fullName" autoComplete="name" placeholder="Aarav Mehta" className={`${AUTH_FIELD} pl-10`} {...register("fullName")} />
          </div>
          {errors.fullName && <p className="text-xs text-destructive font-medium">{errors.fullName.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className={AUTH_LABEL}>
            Email
          </Label>
          <div className="relative">
            <Mail className={AUTH_ICON} />
            <Input id="email" type="email" autoComplete="email" placeholder="you@email.com" className={`${AUTH_FIELD} pl-10`} {...register("email")} />
          </div>
          {errors.email && <p className="text-xs text-destructive font-medium">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className={AUTH_LABEL}>
            Password
          </Label>
          <div className="relative">
            <Lock className={AUTH_ICON} />
            <Input
              id="password"
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className={`${AUTH_FIELD} pl-10 pr-10`}
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
          <Input id="confirmPassword" type={showPw ? "text" : "password"} autoComplete="new-password" placeholder="Repeat password" className={AUTH_FIELD} {...register("confirmPassword")} />
          {errors.confirmPassword && <p className="text-xs text-destructive font-medium">{errors.confirmPassword.message}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting} size="lg" className={AUTH_SUBMIT}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Creating account…
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}
