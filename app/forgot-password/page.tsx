"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
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
          <div className="rounded-2xl border-2 p-5 flex items-start gap-3 bg-primary/5">
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
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
            <Label htmlFor="email" className="font-semibold">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="email" type="email" autoComplete="email" placeholder="you@email.com" className="pl-10 h-11 rounded-full" {...register("email")} />
            </div>
            {errors.email && <p className="text-xs text-destructive font-medium">{errors.email.message}</p>}
          </div>
          <Button type="submit" disabled={isSubmitting} size="lg" className="w-full rounded-full font-bold shadow-[var(--shadow-soft)]">
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
