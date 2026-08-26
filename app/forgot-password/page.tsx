"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AUTH_FIELD, AUTH_ICON, AUTH_LABEL, AUTH_SUBMIT } from "@/components/auth/auth-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(120),
});
type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const [sent, setSent] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  const onSubmit = async ({ email }: FormValues) => {
    try {
      await requestPasswordReset(email);
      setSent(email);
      toast.success("Reset link sent");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not send reset email");
    }
  };

  return (
    <AuthLayout
      title={sent ? "Check your email" : "Forgot password?"}
      subtitle={sent ? `We've sent a reset link to ${sent}.` : "We'll send a reset link to your email."}
      footer={
        <Link href="/login" className="inline-flex items-center gap-1 font-bold text-primary hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
        </Link>
      }
    >
      {sent ? (
        <div className="space-y-5">
          <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <p className="text-sm text-muted-foreground">
              The link expires in 30 minutes. Don&apos;t see it? Check your spam folder or try again.
            </p>
          </div>
          <Button type="button" onClick={() => setSent(null)} variant="outline" className="w-full rounded-full font-bold h-11">
            Try a different email
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
          <Button type="submit" disabled={isSubmitting} size="lg" className={AUTH_SUBMIT}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Sending…
              </>
            ) : (
              "Send reset link"
            )}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
